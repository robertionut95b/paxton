package com.irb.paxton.core.messaging;

import com.irb.paxton.core.messaging.input.MessageInput;
import com.irb.paxton.core.messaging.mapper.MessageMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private MessageMapper messageMapper;

    @Transactional
    public Chat addMessageToChat(MessageInput messageInput) {
        Message message = messageMapper.toEntity(messageInput);
        Chat chat = message.getChat();
        messageRepository.save(message);
        chat.addMessage(message);
        chatRepository.save(chat);
        return chat;
    }
}
