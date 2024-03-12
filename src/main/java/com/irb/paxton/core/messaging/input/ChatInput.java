package com.irb.paxton.core.messaging.input;

import com.irb.paxton.core.messaging.type.ChatType;
import com.irb.paxton.core.model.input.AbstractInput;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.Collection;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class ChatInput extends AbstractInput {

    private Long id;

    @NotNull
    @NotEmpty
    @Size(min = 2, message = "Chat must have at least {min} users")
    private Collection<@NotNull Long> users;

    @NotNull
    private ChatType chatType;

    private Collection<MessageInput> messages;
}
