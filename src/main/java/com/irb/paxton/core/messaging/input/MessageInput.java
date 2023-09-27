package com.irb.paxton.core.messaging.input;

import com.irb.paxton.core.model.input.AbstractInput;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

@Data
public class MessageInput extends AbstractInput {

    private Long id;

    @NotNull
    @NotEmpty
    @NotBlank
    private String content;

    @NotNull
    private Long senderUserId;

    @NotNull
    private Long chatId;
}
