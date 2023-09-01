package com.irb.paxton.core.connection.resolvers;

import com.irb.paxton.core.connection.Connection;
import com.irb.paxton.core.connection.ConnectionService;
import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.security.auth.user.User;
import graphql.kickstart.tools.GraphQLQueryResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class ConnectionQueryResolver implements GraphQLQueryResolver {

    @Autowired
    private ConnectionService connectionService;

    public PaginatedResponse<Connection> getNewConnectionForUser(Long userId, Integer page, Integer size) {
        return this.connectionService.getNewConnectionForUser(userId, page, size);
    }

    public PaginatedResponse<Connection> getConnectionsForUser(Long userId, Integer page, Integer size) {
        return this.connectionService.getConnectionsForUser(userId, page, size);
    }

    public PaginatedResponse<User> getAllUserConnectionSuggestions(Integer page, Integer size) {
        return this.connectionService.getAllUserConnectionSuggestions(page, size);
    }
}
