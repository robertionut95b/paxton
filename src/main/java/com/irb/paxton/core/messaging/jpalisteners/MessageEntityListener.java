package com.irb.paxton.core.messaging.jpalisteners;

import com.irb.paxton.core.messaging.Message;
import com.irb.paxton.core.messaging.MessageSeenBy;
import com.irb.paxton.core.messaging.ws.ChatLiveUpdatesManagerService;
import com.irb.paxton.core.messaging.ws.ChatRoomManagerService;
import com.irb.paxton.security.SecurityUtils;
import com.irb.paxton.storage.StorageService;
import jakarta.persistence.PostLoad;
import jakarta.persistence.PostPersist;
import jakarta.persistence.PostRemove;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.Optional;

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

    @PostLoad
    public void onLoad(Message message) {
        Optional<String> usernameOpt = SecurityUtils.getCurrentUserLogin();
        if (usernameOpt.isPresent()) {
            String username = usernameOpt.get();
            message.setSeenAt(
                    message.getSeenBy().stream()
                            .filter(ms -> ms.getMessage().getId().equals(message.getId()))
                            .filter(ms -> ms.getUser().getUsername().equals(username))
                            .max(Comparator.comparing(MessageSeenBy::getSeenAt))
                            .map(MessageSeenBy::getSeenAt)
                            .orElse(null)
            );
        }
    }
}
