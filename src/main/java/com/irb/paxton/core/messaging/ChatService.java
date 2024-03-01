package com.irb.paxton.core.messaging;

import com.irb.paxton.core.messaging.dto.ChatLiveUpdateDto;
import com.irb.paxton.core.messaging.exceptions.ChatNotFoundException;
import com.irb.paxton.core.messaging.input.ChatInput;
import com.irb.paxton.core.messaging.input.MessageInput;
import com.irb.paxton.core.messaging.mapper.ChatMapper;
import com.irb.paxton.core.messaging.mapper.MessageMapper;
import com.irb.paxton.core.messaging.type.ChatLiveUpdatesManagerService;
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
import lombok.extern.slf4j.Slf4j;
import org.reactivestreams.Publisher;
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
@Slf4j
public class ChatService extends AbstractService<Chat, Long> {

    private final ChatRepository chatRepository;

    private final MessageRepository messageRepository;

    private final MessageMapper messageMapper;

    private final ChatMapper chatMapper;

    private final UserRepository userRepository;

    private final ChatLiveUpdatesManagerService liveUpdatesManagerService;

    private final ChatRoomManagerService chatRoomManagerService;

    public ChatService(AbstractRepository<Chat, Long> repository, ChatRepository chatRepository, MessageRepository messageRepository, MessageMapper messageMapper, ChatMapper chatMapper, UserRepository userRepository, ChatLiveUpdatesManagerService liveUpdatesManagerService, ChatRoomManagerService chatRoomManagerService) {
        super(repository);
        this.chatRepository = chatRepository;
        this.messageRepository = messageRepository;
        this.messageMapper = messageMapper;
        this.chatMapper = chatMapper;
        this.userRepository = userRepository;
        this.liveUpdatesManagerService = liveUpdatesManagerService;
        this.chatRoomManagerService = chatRoomManagerService;
    }

    @Transactional
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR') or @chatSecurityService.isChatMember(#messageInput.chatId, #messageInput.senderUserId)")
    public Chat addMessageToChat(MessageInput messageInput) {
        Message message = messageMapper.toEntity(messageInput);
        Chat chat = message.getChat();
        messageRepository.save(message);
        chat.addMessage(message);
        // publish message to subscribers
        chatRoomManagerService.publishMessageToChannel(chat.getId(), message);
        // publish updates to users in chats
        liveUpdatesManagerService.notifyChatUsersExceptingCurrent(chat.getUsers(), message, chat);
        return chatRepository.save(chat);
    }

    @Transactional
    public Chat createChat(ChatInput chatInput) {
        Chat newChat = this.create(chatMapper.toEntity(chatInput));
        // publish SSE to listeners
        liveUpdatesManagerService.notifyChatUsersExceptingCurrent(newChat.getUsers(), null, newChat);
        return newChat;
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
        // publish SSE to listeners
        liveUpdatesManagerService.notifyChatUsersExceptingCurrent(updatedChat.getUsers(), updatedChat.getLatestMessage(), updatedChat);
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
        Chat findChat = this.chatRepository.findByIdAndChatType(chatId, ChatType.PRIVATE_CHAT)
                .orElseThrow(() -> new ChatNotFoundException("Chat by id %s does not exist".formatted(chatId)));
        this.chatRepository.delete(findChat);
        return findChat;
    }

    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR') or @chatSecurityService.isCurrentUserChatMember(#chatId)")
    public Publisher<Message> getChatMessagesPublisher(Long chatId) {
        return chatRoomManagerService.joinChannel(chatId);
    }

    public Publisher<ChatLiveUpdateDto> getLiveUpdatesForChats(User user) {
        return liveUpdatesManagerService.joinChannel(user.getId());
    }
}
