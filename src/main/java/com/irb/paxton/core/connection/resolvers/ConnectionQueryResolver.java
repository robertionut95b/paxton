package com.irb.paxton.core.connection.resolvers;

import com.irb.paxton.core.connection.Connection;
import com.irb.paxton.core.connection.ConnectionRequest;
import com.irb.paxton.core.connection.ConnectionRequestService;
import com.irb.paxton.core.connection.ConnectionService;
import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SearchRequest;
import com.irb.paxton.security.auth.user.User;
import graphql.kickstart.tools.GraphQLQueryResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class ConnectionQueryResolver implements GraphQLQueryResolver {

    @Autowired
    private ConnectionRequestService connectionRequestService;

    @Autowired
    private ConnectionService connectionService;

    public PaginatedResponse<ConnectionRequest> getConnectionInvitationsForUser(Long userId, Integer page, Integer size) {
        return this.connectionRequestService.findByAddressed(userId, page, size);
    }

    public PaginatedResponse<Connection> getConnections(SearchRequest searchQueryInput) {
        return this.connectionService.advSearch(searchQueryInput);
    }

    public PaginatedResponse<User> getAllUserConnectionSuggestions(Integer page, Integer size) {
        return this.connectionService.getAllUserConnectionSuggestions(page, size);
    }
}
