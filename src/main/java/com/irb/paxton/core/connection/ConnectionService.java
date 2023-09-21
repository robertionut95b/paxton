package com.irb.paxton.core.connection;

import com.irb.paxton.core.connection.exceptions.InvalidConnectionStateException;
import com.irb.paxton.core.connection.input.ConnectionCreateInput;
import com.irb.paxton.core.connection.input.ConnectionUpdateInput;
import com.irb.paxton.core.connection.mapper.ConnectionMapper;
import com.irb.paxton.core.connection.projections.ConnectionUserDto;
import com.irb.paxton.core.connection.status.ConnectionStatus;
import com.irb.paxton.core.model.AbstractRepository;
import com.irb.paxton.core.model.AbstractService;
import com.irb.paxton.core.search.*;
import com.irb.paxton.security.SecurityUtils;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserService;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@Service
public class ConnectionService extends AbstractService<Connection, Long> {

    @Autowired
    private ConnectionRepository connectionRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ConnectionMapper connectionRequestMapper;

    protected ConnectionService(AbstractRepository<Connection, Long> repository) {
        super(repository);
    }

    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR') or @paxtonSecurityService.isCurrentUserById(#connectionCreateInput.requesterId) or @paxtonSecurityService.isCurrentUserById(#connectionCreateInput.addressedId)")
    @Transactional
    public Connection createConnectionRequest(ConnectionCreateInput connectionCreateInput) {
        // check if no reverse entity already exists in the database
        Optional<Connection> existingConnection = connectionRepository
                .findFirstByRequester_IdAndAddressed_Id(connectionCreateInput.getRequesterId(), connectionCreateInput.getAddressedId());
        if (existingConnection.isPresent()) {
            throw new InvalidConnectionStateException("Connection request already exists between users");
        }
        Connection connection = connectionRequestMapper.toEntity(connectionCreateInput);
        return this.connectionRepository.save(connection);
    }

    @PostAuthorize("hasRole('ROLE_ADMINISTRATOR') or @paxtonSecurityService.isCurrentUserById(#connectionUpdateInput.requesterId) or @paxtonSecurityService.isCurrentUserById(#connectionUpdateInput.addressedId)")
    @Transactional
    public Connection updateConnectionRequest(ConnectionUpdateInput connectionUpdateInput) {
        Connection initialConnection = this.findById(connectionUpdateInput.getId());
        Connection connection = connectionRequestMapper.partialUpdate(connectionUpdateInput, initialConnection);
        return connectionRepository.save(connection);
    }

    @PostAuthorize("hasRole('ROLE_ADMINISTRATOR') or @paxtonSecurityService.isCurrentUserById(returnObject.requester.id) or @paxtonSecurityService.isCurrentUserById(returnObject.addressed.id)")
    @Transactional
    public Connection deleteConnection(Long connectionId) {
        Connection initialConnection = this.findById(connectionId);
        connectionRepository.delete(initialConnection);
        return initialConnection;
    }

    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR') or @paxtonSecurityService.isCurrentUserById(#userId)")
    public PaginatedResponse<Connection> getNewConnectionForUser(Long userId, Integer page, Integer size) {
        FilterRequest filterRequest = new FilterRequest("connectionStatus", Operator.EQUAL, FieldType.ENUM, "ConnectionStatus;%s".formatted(ConnectionStatus.REQUESTED), null, null);
        FilterRequest filterRequestAddressed = new FilterRequest("addressed", Operator.EQUAL, FieldType.LONG, userId, null, null);
        SortRequest sortRequest = new SortRequest("createdAt", SortDirection.DESC);
        return super.advSearch(
                new SearchRequest(List.of(filterRequest, filterRequestAddressed), List.of(sortRequest), page != null ? page : 0, size != null ? size : 10)
        );
    }

    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR') or @paxtonSecurityService.isCurrentUserById(#userId)")
    public PaginatedResponse<ConnectionUserDto> getConnectionsForUser(Long userId, Integer page, Integer size, String searchQuery, SortRequest sortRequest) {
        // TODO: find a method to implement sorting at runtime
        //SortRequest sr = sortRequest != null ? sortRequest : new SortRequest("lastModified", SortDirection.DESC);
        Page<ConnectionUserDto> connectionPage = this.connectionRepository
                .findCurrentUserConnectionsByUserId(userId, ConnectionStatus.ACCEPTED, PageRequest.of(page, size), searchQuery != null ? searchQuery : "");
        return new PaginatedResponse<>(connectionPage, connectionPage.getNumber(), connectionPage.getTotalPages(), connectionPage.getTotalElements());
    }

    public PaginatedResponse<User> getAllUserConnectionSuggestions(Integer page, Integer size) {
        Optional<String> optUsername = SecurityUtils.getCurrentUserLogin();
        if (optUsername.isPresent()) {
            String username = optUsername.get();
            User thisUser = this.userService.findByUsername(username)
                    .orElseThrow(() -> new UserNotFoundException("User %s does not exist".formatted(username)));

            List<Connection> userConnectionsList = this.connectionRepository
                    .findByRequester_IdOrAddressed_Id(thisUser.getId(), thisUser.getId());
            List<Object> filterOutIds1 = new ArrayList<>(userConnectionsList.stream().map(c -> c.getRequester().getId()).toList());
            List<Object> filterOutIds2 = new ArrayList<>(userConnectionsList.stream().map(c -> c.getAddressed().getId()).toList());
            // add self user to filtered out ids
            filterOutIds1.add(thisUser.getId());
            // create search filter for users not already in connections
            FilterRequest filterByRequesterUser = new FilterRequest("id", Operator.NOT_IN, FieldType.LONG, null,
                    null, Stream.concat(filterOutIds1.stream(), filterOutIds2.stream()).toList());

            return userService.advSearch(
                    new SearchRequest(List.of(filterByRequesterUser), null, page != null ? page : 0, size != null ? size : 10)
            );
        }
        return null;
    }
}
