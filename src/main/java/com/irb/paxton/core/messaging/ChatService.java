package com.irb.paxton.core.messaging;

import com.irb.paxton.core.messaging.input.ChatInput;
import com.irb.paxton.core.messaging.input.MessageInput;
import com.irb.paxton.core.messaging.mapper.ChatMapper;
import com.irb.paxton.core.messaging.mapper.MessageMapper;
import com.irb.paxton.core.messaging.type.ChatType;
import com.irb.paxton.core.model.AbstractRepository;
import com.irb.paxton.core.model.AbstractService;
import com.irb.paxton.core.search.*;
import com.irb.paxton.exceptions.handler.common.GenericEntityNotFoundException;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserRepository;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
public class ChatService extends AbstractService<Chat, Long> {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private MessageMapper messageMapper;

    @Autowired
    private ChatMapper chatMapper;

    @Autowired
    private UserRepository userRepository;

    public ChatService(AbstractRepository<Chat, Long> repository) {
        super(repository);
    }

    @Transactional
    @PreAuthorize("@chatSecurityService.isChatMember(#messageInput.chatId, #messageInput.senderUserId)")
    public Chat addMessageToChat(MessageInput messageInput) {
        Message message = messageMapper.toEntity(messageInput);
        Chat chat = message.getChat();
        messageRepository.save(message);
        chat.addMessage(message);
        return chatRepository.save(chat);
    }

    @Transactional
    public Chat createChat(ChatInput chatInput) {
        return this.create(chatMapper.toEntity(chatInput));
    }

    @PreAuthorize("@chatSecurityService.isCurrentUserChatMember(#chatId)")
    public Chat getPrivateChatById(Long chatId) {
        return this.chatRepository.findByIdAndChatType(chatId, ChatType.PRIVATE_CHAT)
                .orElseThrow(() -> new GenericEntityNotFoundException("Chat by id %s does not exist".formatted(chatId)));
    }

    @Transactional
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    @PostAuthorize("@chatSecurityService.isCurrentUserChatMember(returnObject.id)")
    public Chat updateChat(ChatInput chatInput) {
        Chat existingChat = this.findById(chatInput.getId());
        Chat updatedChat = this.chatMapper.partialUpdate(chatInput, existingChat);
        return chatRepository.save(updatedChat);
    }

    @Transactional
    @PreAuthorize("@chatSecurityService.isChatMember(#chatId, #userId)")
    public Chat markAllMessagesAsSeen(Long chatId, Long userId) {
        Chat chat = this.findById(chatId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User by id %s does not exist".formatted(userId)));
        chat.markAllMessagesAsSeenByUser(user);
        return this.chatRepository.save(chat);
    }

    @PostAuthorize("@chatSecurityService.isChatMember(authentication, returnObject)")
    public PaginatedResponse<Chat> getChatAdvSearch(SearchRequest searchRequest) {
        searchRequest.getFilters().add(new FilterRequest("chatType", Operator.EQUAL, FieldType.INTEGER, ChatType.PRIVATE_CHAT.ordinal(), null, null));
        return super.advSearch(searchRequest);
    }
}