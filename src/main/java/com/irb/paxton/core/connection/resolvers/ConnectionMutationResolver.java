package com.irb.paxton.core.connection.resolvers;

import com.irb.paxton.core.connection.Connection;
import com.irb.paxton.core.connection.ConnectionService;
import com.irb.paxton.core.connection.input.ConnectionCreateInput;
import com.irb.paxton.core.connection.input.ConnectionUpdateInput;
import graphql.kickstart.tools.GraphQLMutationResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class ConnectionMutationResolver implements GraphQLMutationResolver {

    @Autowired
    private ConnectionService connectionService;

    public Connection createConnection(ConnectionCreateInput connectionCreateInput) {
        return this.connectionService.createConnectionRequest(connectionCreateInput);
    }

    public Connection updateConnection(ConnectionUpdateInput connectionUpdateInput) {
        return this.connectionService.updateConnectionRequest(connectionUpdateInput);
    }

    public Connection removeConnection(Long connectionId) {
        return this.connectionService.deleteConnection(connectionId);
    }
}
