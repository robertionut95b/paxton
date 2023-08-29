package com.irb.paxton.core.connection;

import com.irb.paxton.core.connection.exceptions.InvalidConnectionStateException;
import com.irb.paxton.core.connection.input.ConnectionRequestCreateInput;
import com.irb.paxton.core.connection.input.ConnectionRequestUpdateInput;
import com.irb.paxton.core.connection.mapper.ConnectionRequestMapper;
import com.irb.paxton.core.connection.status.ConnectionStatus;
import com.irb.paxton.core.model.AbstractRepository;
import com.irb.paxton.core.model.AbstractService;
import com.irb.paxton.core.search.*;
import com.irb.paxton.security.SecurityUtils;
import com.irb.paxton.security.service.PaxtonSecurityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class ConnectionRequestService extends AbstractService<ConnectionRequest, Long> {

    @Autowired
    private ConnectionRequestRepository connectionRequestRepository;

    @Autowired
    private ConnectionRequestMapper connectionRequestMapper;

    @Autowired
    private PaxtonSecurityService securityService;

    protected ConnectionRequestService(AbstractRepository<ConnectionRequest, Long> repository) {
        super(repository);
    }

    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR') or @paxtonSecurityService.isCurrentUserById(#userId)")
    public PaginatedResponse<ConnectionRequest> findByAddressed(Long userId, Integer page, Integer size) {
        FilterRequest filterByRequesterUser = new FilterRequest("addressed.id", Operator.EQUAL, FieldType.LONG, userId,
                null, null);
        FilterRequest filterByRequestedStatus = new FilterRequest("connectionStatus", Operator.EQUAL, FieldType.ENUM, "%s;%s".formatted("ConnectionStatus", ConnectionStatus.REQUESTED),
                null, null);
        return super.advSearch(new SearchRequest(
                List.of(filterByRequesterUser, filterByRequestedStatus), null, page != null ? page : 0, size != null ? size : 10));
    }

    @Transactional
    @PostAuthorize("hasRole('ROLE_ADMINISTRATOR') or (authentication.id == returnObject.requester.id or authentication.id == returnObject.addressed.id)")
    public ConnectionRequest createConnectionRequest(ConnectionRequestCreateInput connectionRequestCreateInput) {
        ConnectionRequest connectionRequest = this.connectionRequestMapper.toEntity(connectionRequestCreateInput);
        // check if the requester user is not the same user
        Optional<String> currentUserNameOpt = SecurityUtils.getCurrentUserLogin();
        if (currentUserNameOpt.isPresent()) {
            String username = currentUserNameOpt.get();
            if (connectionRequest.getRequester().getUsername().equals(username)) {
                throw new InvalidConnectionStateException("Requester user cannot be the current logged-in user");
            }
        }
        return this.connectionRequestRepository.save(connectionRequest);
    }

    @Transactional
    @PostAuthorize("hasRole('ROLE_ADMINISTRATOR') or (authentication.id == returnObject.requester.id or authentication.id == returnObject.addressed.id)")
    public ConnectionRequest updateConnectionRequest(ConnectionRequestUpdateInput connectionRequestUpdateInput) {
        ConnectionRequest connectionRequest = this.findById(connectionRequestUpdateInput.getId());
        if (connectionRequest.getConnectionStatus().equals(ConnectionStatus.DECLINED) || connectionRequest.getConnectionStatus().equals(ConnectionStatus.BLOCKED)) {
            throw new InvalidConnectionStateException("Cannot update a blocked or declined connection request");
        }
        connectionRequest.setConnectionStatus(connectionRequestUpdateInput.getConnectionStatus());
        return this.connectionRequestRepository.save(connectionRequest);
    }
}
