package com.irb.paxton.core.messaging.dto;

import com.irb.paxton.core.messaging.Message;
import com.irb.paxton.core.model.Identifiable;
import com.irb.paxton.core.model.input.AbstractInput;
import com.irb.paxton.security.auth.user.User;
import lombok.Data;

import java.util.Collection;

@Data
public class ChatLiveUpdateDto extends AbstractInput implements Identifiable<Long> {

    private Long id;

    private Collection<User> users;

    private String title;

    private Message latestMessage;

    private long unreadMessagesCount;
}
