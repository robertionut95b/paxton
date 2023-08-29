package com.irb.paxton.core.connection;

import com.irb.paxton.core.connection.input.ConnectionRequestCreateInput;
import com.irb.paxton.core.connection.input.ConnectionRequestUpdateInput;
import com.irb.paxton.core.connection.status.ConnectionStatus;
import com.irb.paxton.core.model.AbstractRepository;
import com.irb.paxton.core.model.AbstractService;
import com.irb.paxton.core.search.*;
import com.irb.paxton.security.SecurityUtils;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserService;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ConnectionService extends AbstractService<Connection, Long> {

    @Autowired
    private ConnectionRepository connectionRepository;

    @Autowired
    private ConnectionRequestService connectionRequestService;

    @Autowired
    private UserService userService;

    protected ConnectionService(AbstractRepository<Connection, Long> repository) {
        super(repository);
    }

    public Connection createConnection(Connection connection) {
        return this.connectionRepository.save(connection);
    }

    public ConnectionRequest createConnectionRequest(ConnectionRequestCreateInput connectionRequestCreateInput) {
        return this.connectionRequestService.createConnectionRequest(connectionRequestCreateInput);
    }

    @Transactional
    public Connection updateConnectionRequest(ConnectionRequestUpdateInput connectionRequestUpdateInput) {
        ConnectionRequest connectionRequest = this.connectionRequestService.updateConnectionRequest(connectionRequestUpdateInput);
        Connection connection = new Connection(connectionRequest.getRequester(), connectionRequest.getAddressed(), connectionRequestUpdateInput.getConnectionStatus());
        return connectionRepository.save(connection);
    }

    public PaginatedResponse<User> getAllUserConnectionSuggestions(Integer page, Integer size) {
        Optional<String> optUsername = SecurityUtils.getCurrentUserLogin();
        if (optUsername.isPresent()) {
            String username = optUsername.get();
            User thisUser = this.userService.findByUsername(username)
                    .orElseThrow(() -> new UserNotFoundException("User %s does not exist".formatted(username)));
            List<Connection> userConnectionsList = this.connectionRepository.findBySecondUser_UsernameAndConnectionStatusIn(username, List.of(ConnectionStatus.ACCEPTED));
            List<Object> filterOutIds = new ArrayList<>(userConnectionsList.stream().map(c -> c.getFirstUser().getId()).toList());
            // add self user to filtered out ids
            filterOutIds.add(thisUser.getId());
            // create search filter for users not already in connections
            FilterRequest filterByRequesterUser = new FilterRequest("id", Operator.NOT_IN, FieldType.LONG, null,
                    null, filterOutIds);
            return userService.advSearch(new SearchRequest(
                    List.of(filterByRequesterUser), null, page != null ? page : 0, size != null ? size : 10));
        }
        return null;
    }
}
