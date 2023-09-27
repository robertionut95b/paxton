package com.irb.paxton.core.connection.resolvers;

import com.irb.paxton.core.connection.Connection;
import com.irb.paxton.core.connection.ConnectionService;
import com.irb.paxton.core.connection.input.ConnectionCreateInput;
import com.irb.paxton.core.connection.input.ConnectionUpdateInput;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.InputArgument;
import org.springframework.beans.factory.annotation.Autowired;

@DgsComponent
public class ConnectionMutationResolver {

    @Autowired
    private ConnectionService connectionService;

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
