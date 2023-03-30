package com.irb.paxton.core.messaging.input;

import com.irb.paxton.core.model.input.AbstractInput;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.time.OffsetDateTime;

@Data
public class MessageSeenByInput extends AbstractInput {

    private Long id;

    @NotNull
    private Long userId;

    @NotNull
    private Long messageId;

    private OffsetDateTime seenAt = OffsetDateTime.now();
}
