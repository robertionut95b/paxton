package com.irb.paxton.core.connection.resolvers;

import com.irb.paxton.core.connection.Connection;
import com.irb.paxton.core.connection.ConnectionService;
import com.irb.paxton.core.connection.projections.ConnectionUserDto;
import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SortRequest;
import com.irb.paxton.security.auth.user.User;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import org.springframework.beans.factory.annotation.Autowired;

@DgsComponent
public class ConnectionQueryResolver {

    @Autowired
    private ConnectionService connectionService;

    @DgsQuery
    public PaginatedResponse<Connection> getNewConnectionForUser(@InputArgument Long userId, @InputArgument Integer page, @InputArgument Integer size) {
        return this.connectionService.getNewConnectionForUser(userId, page, size);
    }

    @DgsQuery
    public PaginatedResponse<ConnectionUserDto> getConnectionsForUser(@InputArgument Long userId, @InputArgument Integer page, @InputArgument Integer size, @InputArgument String searchQuery, @InputArgument SortRequest sortBy) {
        return this.connectionService.getConnectionsForUser(userId, page, size, searchQuery, sortBy);
    }

    @DgsQuery
    public PaginatedResponse<User> getAllUserConnectionSuggestions(@InputArgument Integer page, @InputArgument Integer size) {
        return this.connectionService.getAllUserConnectionSuggestions(page, size);
    }
}
