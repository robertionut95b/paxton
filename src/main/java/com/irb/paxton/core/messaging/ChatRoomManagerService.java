package com.irb.paxton.core.messaging;

import com.irb.paxton.core.model.messaging.AbstractWsMessagingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class ChatRoomManagerService extends AbstractWsMessagingService<Long, Message> {

    @Override
    public void publishMessageToChannel(Long identifier, Message message) {
        super.publishMessageToChannel(identifier, message);
        log.debug("Chat message [%d bytes] sent to chat room [chatId=%d]"
                .formatted(message.toString().getBytes().length, identifier));
    }
}
