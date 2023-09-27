package com.irb.paxton.core.connection.input;

import com.irb.paxton.core.connection.status.ConnectionStatus;
import com.irb.paxton.core.model.input.AbstractInput;
import lombok.Data;

import jakarta.validation.constraints.NotNull;

@Data
public class ConnectionUpdateInput extends AbstractInput {

    @NotNull
    private Long id;

    @NotNull
    private Long requesterId;

    @NotNull
    private Long addressedId;

    @NotNull
    private ConnectionStatus connectionStatus;
}
