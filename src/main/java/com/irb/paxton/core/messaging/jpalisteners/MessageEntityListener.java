package com.irb.paxton.core.messaging.jpalisteners;

import com.irb.paxton.core.messaging.ChatRoomManagerService;
import com.irb.paxton.core.messaging.Message;
import com.irb.paxton.core.messaging.type.ChatLiveUpdatesManagerService;
import jakarta.persistence.PostPersist;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class MessageEntityListener {

    private final ChatLiveUpdatesManagerService liveUpdatesManagerService;

    private final ChatRoomManagerService chatRoomManagerService;

    public MessageEntityListener(ChatLiveUpdatesManagerService liveUpdatesManagerService, ChatRoomManagerService chatRoomManagerService) {
        this.liveUpdatesManagerService = liveUpdatesManagerService;
        this.chatRoomManagerService = chatRoomManagerService;
    }

    @PostPersist
    private void postCreate(Message message) {
        log.debug("Created message entity in chatId={}, sending message to subscribers [userIds={}]",
                message.getChat().getId(),
                String.join(", ", message.getChat().getUsers().stream().map(u -> u.getId().toString()).toList())
        );
        chatRoomManagerService.publishMessageToChannel(message.getChat().getId(), message);
        liveUpdatesManagerService.notifyChatUsersExceptingCurrent(
                message.getChat().getUsers(), message, message.getChat().toChatLiveUpdateDto()
        );
    }
}
