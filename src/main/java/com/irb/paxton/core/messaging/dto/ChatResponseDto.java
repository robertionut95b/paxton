package com.irb.paxton.core.messaging.dto;

import com.irb.paxton.core.messaging.Message;
import com.irb.paxton.core.messaging.type.ChatType;
import com.irb.paxton.core.model.input.AbstractInput;
import com.irb.paxton.security.auth.user.User;
import lombok.Data;

import java.util.Collection;

@Data
public class ChatResponseDto extends AbstractInput {

    private Long id;

    private Collection<User> users;

    private String title;

    private ChatType chatType;

    private Message latestMessage;

    private long unreadMessagesCount;
}
