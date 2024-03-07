package com.irb.paxton.core.messaging.jpalisteners;

import com.irb.paxton.core.messaging.Chat;
import com.irb.paxton.core.messaging.ws.ChatLiveUpdatesManagerService;
import jakarta.persistence.PostPersist;
import jakarta.persistence.PostUpdate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ChatEntityListener {

    private final ChatLiveUpdatesManagerService liveUpdatesManagerService;

    public ChatEntityListener(ChatLiveUpdatesManagerService liveUpdatesManagerService) {
        this.liveUpdatesManagerService = liveUpdatesManagerService;
    }

    @PostUpdate
    private void postUpdate(Chat chat) {
        log.debug("Updated chat entity [chatId={}], sending message to subscribers [userIds={}]",
                chat.getId(),
                String.join(", ", chat.getUsers().stream().map(u -> u.getId().toString()).toList())
        );
        liveUpdatesManagerService.notifyChatUsersExceptingCurrent(chat.getUsers(), chat.getLatestMessage(), chat.toChatLiveUpdateDto());
    }

    @PostPersist
    private void postCreate(Chat chat) {
        log.debug("Created new chat entity [chatId={}], sending message to subscribers [userIds={}]",
                chat.getId(),
                String.join(", ", chat.getUsers().stream().map(u -> u.getId().toString()).toList())
        );
        liveUpdatesManagerService.notifyChatUsersExceptingCurrent(chat.getUsers(), null, chat.toChatLiveUpdateDto());
    }
}
