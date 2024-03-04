package com.irb.paxton.core.messaging;

import com.irb.paxton.core.messaging.dto.ChatLiveUpdateDto;
import com.irb.paxton.core.messaging.dto.ChatResponseDto;
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
import com.irb.paxton.security.AuthenticationService;
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
public class ChatService extends AbstractService<Chat> {

    public static final String CHAT_BY_ID_S_DOES_NOT_EXIST = "Chat by id %s does not exist";

    private final ChatRepository chatRepository;

    private final MessageRepository messageRepository;

    private final MessageMapper messageMapper;

    private final ChatMapper chatMapper;

    private final UserRepository userRepository;

    private final AuthenticationService authenticationService;

    private final ChatLiveUpdatesManagerService liveUpdatesManagerService;

    private final ChatRoomManagerService chatRoomManagerService;

    public ChatService(AbstractRepository<Chat> repository, ChatRepository chatRepository, MessageRepository messageRepository, MessageMapper messageMapper, ChatMapper chatMapper, UserRepository userRepository, AuthenticationService authenticationService, ChatLiveUpdatesManagerService liveUpdatesManagerService, ChatRoomManagerService chatRoomManagerService) {
        super(repository);
        this.chatRepository = chatRepository;
        this.messageRepository = messageRepository;
        this.messageMapper = messageMapper;
        this.chatMapper = chatMapper;
        this.userRepository = userRepository;
        this.authenticationService = authenticationService;
        this.liveUpdatesManagerService = liveUpdatesManagerService;
        this.chatRoomManagerService = chatRoomManagerService;
    }

    @Transactional
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR') or @chatSecurityService.isChatMember(#messageInput.chatId, #messageInput.senderUserId)")
    public ChatResponseDto addMessageToChat(MessageInput messageInput) {
        Message message = messageMapper.toEntity(messageInput);
        Chat chat = message.getChat();
        messageRepository.persist(message);
        chat.addMessage(message);
        // publish message to subscribers
        chatRoomManagerService.publishMessageToChannel(chat.getId(), message);
        // publish updates to users in chats
        liveUpdatesManagerService.notifyChatUsersExceptingCurrent(chat.getUsers(), message, chat);
        this.update(chat);
        return chatMapper.toChatResponseDto(chat);
    }

    @Transactional
    public ChatResponseDto createChat(ChatInput chatInput) {
        Chat newChat = this.create(chatMapper.toEntity(chatInput));
        // publish SSE to listeners
        liveUpdatesManagerService.notifyChatUsersExceptingCurrent(newChat.getUsers(), null, newChat);
        return chatMapper.toChatResponseDto(newChat);
    }

    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR') or @chatSecurityService.isCurrentUserChatMemberById(#chatId)")
    public ChatResponseDto getPrivateChatById(Long chatId) {
        return chatMapper.toChatResponseDto(this.chatRepository.findByIdAndChatType(chatId, ChatType.PRIVATE_CHAT)
                .orElseThrow(() -> new GenericEntityNotFoundException(CHAT_BY_ID_S_DOES_NOT_EXIST.formatted(chatId))));
    }

    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR') or @chatSecurityService.isCurrentUserChatMemberByUrlId(#chatUrlId)")
    public ChatResponseDto getPrivateChatByUrlId(String chatUrlId) {
        return chatMapper.toChatResponseDto(this.chatRepository.findByUrlIdAndChatType(chatUrlId, ChatType.PRIVATE_CHAT)
                .orElseThrow(() -> new GenericEntityNotFoundException(CHAT_BY_ID_S_DOES_NOT_EXIST.formatted(chatUrlId))));
    }

    @Transactional
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    @PostAuthorize("hasRole('ROLE_ADMINISTRATOR') or @chatSecurityService.isCurrentUserChatMember(returnObject.id)")
    public ChatResponseDto updateChat(ChatInput chatInput) {
        Chat existingChat = this.findById(chatInput.getId());
        Chat updatedChat = this.chatMapper.partialUpdate(chatInput, existingChat);
        // publish SSE to listeners
        liveUpdatesManagerService.notifyChatUsersExceptingCurrent(updatedChat.getUsers(), updatedChat.getLatestMessage(), updatedChat);
        this.update(updatedChat);
        return chatMapper.toChatResponseDto(updatedChat);
    }

    @Transactional
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR') or @chatSecurityService.isChatMember(#chatId, #userId)")
    public ChatResponseDto markAllMessagesAsSeen(Long chatId, Long userId) {
        Chat chat = this.findById(chatId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User by id %s does not exist".formatted(userId)));
        chat.markAllMessagesAsSeenByUser(user);
        this.update(chat);
        return chatMapper.toChatResponseDto(chat);
    }

    @PostAuthorize("hasRole('ROLE_ADMINISTRATOR') or @chatSecurityService.isChatMember(authentication, returnObject)")
    public PaginatedResponse<Chat> getChatAdvSearch(@Valid SearchRequest searchRequest) {
        searchRequest.getFilters().add(new FilterRequest("chatType", Operator.EQUAL, FieldType.INTEGER, ChatType.PRIVATE_CHAT.ordinal(), null, null));
        return super.advSearch(searchRequest);
    }

    @PostAuthorize("hasRole('ROLE_ADMINISTRATOR') or @chatSecurityService.isCurrentUserChatMember(returnObject.id)")
    public ChatResponseDto getChatWithUserId(Long userId) {
        Authentication authentication = SecurityUtils.getCurrentUserAuth();
        User thisUser = this.userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new UserNotFoundException("Current user must be logged in"));
        List<Chat> chats = chatRepository.findDistinctByUsers_IdIn(List.of(thisUser.getId(), userId));

        return chatMapper
                .toChatResponseDto(chats.stream()
                        .filter(c -> c.getUsers().size() == 2 && c.getUsers().stream().allMatch(u -> u.getId().equals(thisUser.getId()) || u.getId().equals(userId)))
                        .findFirst()
                        .orElseThrow(() -> new ChatNotFoundException("Chat does not exist between users [%s - %s]".formatted(thisUser.getId(), userId))));
    }

    @PostAuthorize("hasRole('ROLE_ADMINISTRATOR') or @chatSecurityService.isChatMember(authentication, returnObject)")
    public List<ChatResponseDto> getChatsWithUsersIds(List<Long> userIds, ChatType chatType) {
        User thisUser = this.authenticationService.getCurrentUserFromSecurityContext();
        List<Chat> chats = chatRepository
                .findDistinctByUsers_IdIn(Stream.concat(userIds.stream(), Stream.of(thisUser.getId())).toList());
        HashSet<User> thoseUsers = userIds
                .stream()
                .map(uid -> userRepository.findById(uid).orElseThrow(() -> new UserNotFoundException("User by id %s does not exist".formatted(uid))))
                .collect(Collectors.toCollection(HashSet::new));

        return chats.stream()
                .filter(c -> c.getUsers().size() == userIds.size() && c.getUsers().containsAll(thoseUsers))
                .filter(c -> c.getChatType().equals(chatType))
                .map(chatMapper::toChatResponseDto)
                .toList();
    }

    @Transactional
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR') or @chatSecurityService.isCurrentUserChatMember(#chatId)")
    public ChatResponseDto removeChatById(Long chatId) {
        Chat findChat = this.chatRepository.findByIdAndChatType(chatId, ChatType.PRIVATE_CHAT)
                .orElseThrow(() -> new ChatNotFoundException(CHAT_BY_ID_S_DOES_NOT_EXIST.formatted(chatId)));
        // leave chat instead of deletion
        User currentUser = this.authenticationService.getCurrentUserFromSecurityContext();
        findChat.leaveChatForUser(currentUser);
        return chatMapper.toChatResponseDto(findChat);
    }

    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR') or @chatSecurityService.isCurrentUserChatMemberById(#chatId)")
    public Publisher<Message> getChatMessagesPublisher(Long chatId) {
        return chatRoomManagerService.joinChannel(chatId);
    }

    public Publisher<ChatLiveUpdateDto> getLiveUpdatesForChats(User user) {
        return liveUpdatesManagerService.joinChannel(user.getId());
    }
}
