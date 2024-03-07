package com.irb.paxton.core.messaging.jpalisteners;

import com.irb.paxton.core.messaging.Message;
import com.irb.paxton.core.messaging.ws.ChatLiveUpdatesManagerService;
import com.irb.paxton.core.messaging.ws.ChatRoomManagerService;
import jakarta.persistence.PostPersist;
import jakarta.persistence.PostRemove;
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

    @PostRemove
    private void postDelete(Message message) {
        if (message.getFileContents() == null) return;
        // TODO: treat file deletions in the storage system if the message entity is removed
    }
}
