package com.irb.paxton.core.messaging.security;

import com.irb.paxton.core.messaging.Chat;
import com.irb.paxton.core.messaging.Message;
import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SlicedResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Slice;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service(value = "messageSecurityService")
public class MessageSecurityServiceImpl implements MessageSecurityService {

    @Override
    public boolean isMessageChatMember(Authentication authentication, PaginatedResponse<Object> response) {
        Page<Object> list = response.getList();
        return list.stream().allMatch(o -> {
            if (o instanceof Message message) {
                Chat messageChat = message.getChat();
                return messageChat
                        .getUsers()
                        .stream()
                        .anyMatch(user -> user.getUsername().equals(authentication.getName()));
            } else return false;
        });
    }

    @Override
    public boolean isMessageChatMember(Authentication authentication, SlicedResponse<Object> response) {
        Slice<Object> list = response.getList();
        return list.stream().allMatch(o -> {
            if (o instanceof Message message) {
                Chat messageChat = message.getChat();
                return messageChat
                        .getUsers()
                        .stream()
                        .anyMatch(user -> user.getUsername().equals(authentication.getName()));
            } else return false;
        });
    }
}
