package com.irb.paxton.core.messaging;

import com.irb.paxton.core.messaging.exceptions.ChatNotFoundException;
import com.irb.paxton.core.messaging.input.ChatInput;
import com.irb.paxton.core.messaging.input.MessageInput;
import com.irb.paxton.core.messaging.mapper.ChatMapper;
import com.irb.paxton.core.messaging.mapper.MessageMapper;
import com.irb.paxton.core.messaging.type.ChatType;
import com.irb.paxton.core.model.AbstractRepository;
import com.irb.paxton.core.model.AbstractService;
import com.irb.paxton.core.search.*;
import com.irb.paxton.exceptions.handler.common.GenericEntityNotFoundException;
import com.irb.paxton.security.SecurityUtils;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserRepository;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.reactivestreams.Publisher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@Validated
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

    @Autowired
    private ChatRoomManager chatStream;

    public ChatService(AbstractRepository<Chat, Long> repository) {
        super(repository);
    }

    @Transactional
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR') or @chatSecurityService.isChatMember(#messageInput.chatId, #messageInput.senderUserId)")
    public Chat addMessageToChat(MessageInput messageInput) {
        Message message = messageMapper.toEntity(messageInput);
        Chat chat = message.getChat();
        messageRepository.save(message);
        chat.addMessage(message);
        // publish message to subscribers
        chatStream.publishMessageToRoom(chat.getId(), message);
        return chatRepository.save(chat);
    }

    @Transactional
    public Chat createChat(ChatInput chatInput) {
        return this.create(chatMapper.toEntity(chatInput));
    }

    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR') or @chatSecurityService.isCurrentUserChatMember(#chatId)")
    public Chat getPrivateChatById(Long chatId) {
        return this.chatRepository.findByIdAndChatType(chatId, ChatType.PRIVATE_CHAT)
                .orElseThrow(() -> new GenericEntityNotFoundException("Chat by id %s does not exist".formatted(chatId)));
    }

    @Transactional
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    @PostAuthorize("hasRole('ROLE_ADMINISTRATOR') or @chatSecurityService.isCurrentUserChatMember(returnObject.id)")
    public Chat updateChat(ChatInput chatInput) {
        Chat existingChat = this.findById(chatInput.getId());
        Chat updatedChat = this.chatMapper.partialUpdate(chatInput, existingChat);
        return chatRepository.save(updatedChat);
    }

    @Transactional
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR') or @chatSecurityService.isChatMember(#chatId, #userId)")
    public Chat markAllMessagesAsSeen(Long chatId, Long userId) {
        Chat chat = this.findById(chatId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User by id %s does not exist".formatted(userId)));
        chat.markAllMessagesAsSeenByUser(user);
        return this.chatRepository.save(chat);
    }

    @PostAuthorize("hasRole('ROLE_ADMINISTRATOR') or @chatSecurityService.isChatMember(authentication, returnObject)")
    public PaginatedResponse<Chat> getChatAdvSearch(@Valid SearchRequest searchRequest) {
        searchRequest.getFilters().add(new FilterRequest("chatType", Operator.EQUAL, FieldType.INTEGER, ChatType.PRIVATE_CHAT.ordinal(), null, null));
        return super.advSearch(searchRequest);
    }

    @PostAuthorize("hasRole('ROLE_ADMINISTRATOR') or @chatSecurityService.isCurrentUserChatMember(returnObject.id)")
    public Chat getChatWithUserId(Long userId) {
        Authentication authentication = SecurityUtils.getCurrentUserAuth();
        User thisUser = this.userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new UserNotFoundException("Current user must be logged in"));
        List<Chat> chats = chatRepository.findDistinctByUsers_IdIn(List.of(thisUser.getId(), userId));

        return chats.stream()
                .filter(c -> c.getUsers().size() == 2 && c.getUsers().stream().allMatch(u -> u.getId().equals(thisUser.getId()) || u.getId().equals(userId)))
                .findFirst()
                .orElseThrow(() -> new ChatNotFoundException("Chat does not exist between users [%s - %s]".formatted(thisUser.getId(), userId)));
    }

    @PostAuthorize("hasRole('ROLE_ADMINISTRATOR') or @chatSecurityService.isChatMember(authentication, returnObject)")
    public List<Chat> getChatsWithUsersIds(List<Long> userIds, ChatType chatType) {
        Authentication authentication = SecurityUtils.getCurrentUserAuth();
        User thisUser = this.userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new UserNotFoundException("Current user must be logged in"));

        List<Chat> chats = chatRepository
                .findDistinctByUsers_IdIn(Stream.concat(userIds.stream(), Stream.of(thisUser.getId())).toList());
        HashSet<User> thoseUsers = userIds
                .stream()
                .map(uid -> userRepository.findById(uid).orElseThrow(() -> new UserNotFoundException("User by id %s does not exist".formatted(uid))))
                .collect(Collectors.toCollection(HashSet::new));

        return chats.stream()
                .filter(c -> c.getUsers().size() == userIds.size() && c.getUsers().containsAll(thoseUsers))
                .filter(c -> c.getChatType().equals(chatType))
                .toList();
    }

    @Transactional
    @PostAuthorize("hasRole('ROLE_ADMINISTRATOR') or @chatSecurityService.isCurrentUserChatMember(returnObject.id)")
    public Chat removeChatById(Long chatId) {
        Chat findChat = this.chatRepository.findById(chatId)
                .orElseThrow(() -> new ChatNotFoundException("Chat by id %s does not exist".formatted(chatId)));
        this.chatRepository.delete(findChat);
        return findChat;
    }

    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR') or @chatSecurityService.isCurrentUserChatMember(#chatId)")
    public Publisher<Message> getChatMessagesPublisher(Long chatId) {
        return chatStream.joinRoom(chatId);
    }
}
