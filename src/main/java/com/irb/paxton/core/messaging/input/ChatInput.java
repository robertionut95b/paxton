package com.irb.paxton.core.messaging.input;

import com.irb.paxton.core.messaging.type.ChatType;
import com.irb.paxton.core.model.input.AbstractInput;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Collection;

@Data
public class ChatInput extends AbstractInput {

    private Long id;

    @NotEmpty
    private Collection<Long> users;

    @NotNull
    private ChatType chatType;
    
    private Collection<MessageInput> messages;
}
