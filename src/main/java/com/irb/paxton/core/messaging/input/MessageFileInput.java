package com.irb.paxton.core.messaging.input;

import com.irb.paxton.core.model.input.AbstractInput;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MessageFileInput extends AbstractInput {

    private Long id;

    @NotNull
    private Long senderUserId;

    @NotNull
    private Long chatId;
}
