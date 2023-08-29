package com.irb.paxton.core.connection.resolvers;

import com.irb.paxton.core.connection.Connection;
import com.irb.paxton.core.connection.ConnectionRequest;
import com.irb.paxton.core.connection.ConnectionService;
import com.irb.paxton.core.connection.input.ConnectionRequestCreateInput;
import com.irb.paxton.core.connection.input.ConnectionRequestUpdateInput;
import graphql.kickstart.tools.GraphQLMutationResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class ConnectionMutationResolver implements GraphQLMutationResolver {

    @Autowired
    private ConnectionService connectionService;

    public ConnectionRequest createConnectionRequest(ConnectionRequestCreateInput connectionRequestCreateInput) {
        return this.connectionService.createConnectionRequest(connectionRequestCreateInput);
    }

    public Connection updateConnection(ConnectionRequestUpdateInput connectionRequestUpdateInput) {
        return this.connectionService.updateConnectionRequest(connectionRequestUpdateInput);
    }
}
