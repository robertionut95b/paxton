package com.irb.paxton.core.messaging.ws;

import com.irb.paxton.core.messaging.Message;
import com.irb.paxton.core.messaging.dto.ChatLiveUpdateDto;
import com.irb.paxton.core.model.messaging.AbstractWsMessagingService;
import com.irb.paxton.security.SecurityUtils;
import com.irb.paxton.security.auth.user.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Optional;

@Service
@Slf4j
public class ChatLiveUpdatesManagerService extends AbstractWsMessagingService<Long, ChatLiveUpdateDto> {

    @Override
    public void publishMessageToChannel(Long identifier, ChatLiveUpdateDto message) {
        super.publishMessageToChannel(identifier, message);
        log.debug("Sent chat update message [%d bytes] sent to user [userId=%d]"
                .formatted(message.toString().getBytes().length, identifier));
    }

    public void notifyChatUsersExceptingCurrent(Collection<User> users, Message latestMessage, ChatLiveUpdateDto chatUpdate) {
        users.forEach(u -> {
            Optional<String> currentUsername = SecurityUtils.getCurrentUserLogin();
            // update this instance by deep cloning and add latest message as the current saving message
            chatUpdate.setLatestMessage(latestMessage);
            if (currentUsername.isPresent() && !u.getUsername().equalsIgnoreCase(currentUsername.get())) {
                // do not send SSE to the current user as it is obsolete
                this.publishMessageToChannel(u.getId(), chatUpdate);
            }
        });
    }
}
