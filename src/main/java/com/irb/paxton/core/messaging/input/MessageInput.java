package com.irb.paxton.core.messaging.input;

import com.irb.paxton.core.model.input.AbstractInput;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
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
