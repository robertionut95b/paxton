package com.irb.paxton.core.connection.resolvers;

import com.irb.paxton.core.connection.Connection;
import com.irb.paxton.core.connection.ConnectionService;
import com.irb.paxton.core.connection.input.ConnectionCreateInput;
import com.irb.paxton.core.connection.input.ConnectionUpdateInput;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.InputArgument;

@DgsComponent
public class ConnectionMutationResolver {

    private final ConnectionService connectionService;

    public ConnectionMutationResolver(ConnectionService connectionService) {
        this.connectionService = connectionService;
    }

    @DgsMutation
    public Connection createConnection(@InputArgument ConnectionCreateInput connectionCreateInput) {
        return this.connectionService.createConnectionRequest(connectionCreateInput);
    }

    @DgsMutation
    public Connection updateConnection(@InputArgument ConnectionUpdateInput connectionRequestInput) {
        return this.connectionService.updateConnectionRequest(connectionRequestInput);
    }

    @DgsMutation
    public Connection removeConnection(@InputArgument Long connectionId) {
        return this.connectionService.deleteConnection(connectionId);
    }
}
