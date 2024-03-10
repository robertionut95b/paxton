package com.irb.paxton.core.messaging.jpalisteners;

import com.irb.paxton.core.messaging.Message;
import com.irb.paxton.core.messaging.ws.ChatLiveUpdatesManagerService;
import com.irb.paxton.core.messaging.ws.ChatRoomManagerService;
import com.irb.paxton.storage.StorageService;
import jakarta.persistence.PostPersist;
import jakarta.persistence.PostRemove;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class MessageEntityListener {

    private final ChatLiveUpdatesManagerService liveUpdatesManagerService;

    private final ChatRoomManagerService chatRoomManagerService;

    private final StorageService storageService;

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
        message.getFileContents().forEach(file -> storageService.remove(file.getPath()));
    }
}
