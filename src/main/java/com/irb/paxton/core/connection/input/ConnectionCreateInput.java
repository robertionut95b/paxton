package com.irb.paxton.core.connection.input;

import com.irb.paxton.core.connection.status.ConnectionStatus;
import com.irb.paxton.core.model.input.AbstractInput;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class ConnectionCreateInput extends AbstractInput {

    private Long id;

    @NotNull
    private Long requesterId;

    @NotNull
    private Long addressedId;

    @NotNull
    private ConnectionStatus connectionStatus = ConnectionStatus.REQUESTED;
}
