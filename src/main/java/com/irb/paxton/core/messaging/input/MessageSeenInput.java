package com.irb.paxton.core.messaging.input;

import com.irb.paxton.core.model.input.AbstractInput;
import lombok.Data;

import jakarta.validation.constraints.NotNull;

@Data
public class MessageSeenInput extends AbstractInput {

    private Long id;

    @NotNull
    private long userId;
}
