package com.irb.paxton.core.messaging.security;

import com.irb.paxton.core.messaging.Chat;
import com.irb.paxton.core.messaging.ChatRepository;
import com.irb.paxton.core.messaging.dto.ChatResponseDto;
import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.exceptions.handler.common.GenericEntityNotFoundException;
import com.irb.paxton.security.AuthenticationService;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserRepository;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service(value = "chatSecurityService")
public class ChatSecurityServiceImpl implements ChatSecurityService {

    private final UserRepository userRepository;

    private final ChatRepository chatRepository;

    private final AuthenticationService authenticationService;

    public ChatSecurityServiceImpl(UserRepository userRepository, ChatRepository chatRepository, AuthenticationService authenticationService) {
        this.userRepository = userRepository;
        this.chatRepository = chatRepository;
        this.authenticationService = authenticationService;
    }

    @Override
    public boolean isChatMember(Authentication authentication, PaginatedResponse<Object> response) {
        Page<Object> list = response.getList();
        return list.stream().allMatch(o -> {
            if (o instanceof Chat chat) {
                return chat
                        .getUsers()
                        .stream()
                        .anyMatch(user -> user.getUsername().equals(authentication.getName()));
            } else if (o instanceof ChatResponseDto chatResponseDto) {
                return chatResponseDto
                        .getUsers()
                        .stream()
                        .anyMatch(user -> user.getUsername().equals(authentication.getName()));
            } else return false;
        });
    }

    @Override
    public boolean isChatMember(Authentication authentication, List<Object> response) {
        return response.stream().allMatch(o -> {
            if (o instanceof Chat chat) {
                return chat
                        .getUsers()
                        .stream()
                        .anyMatch(user -> user.getUsername().equals(authentication.getName()));
            } else if (o instanceof ChatResponseDto chatResponseDto) {
                return chatResponseDto
                        .getUsers()
                        .stream()
                        .anyMatch(user -> user.getUsername().equals(authentication.getName()));
            } else return false;
        });
    }

    @Override
    public boolean isCurrentUserChatMemberById(Long chatId) {
        User user = this.authenticationService.getCurrentUserFromSecurityContext();
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new GenericEntityNotFoundException("Chat by id %s does not exist".formatted(chatId)));
        return chat.getUsers().contains(user);
    }

    @Override
    public boolean isCurrentUserChatMemberByUrlId(String chatUrlId) {
        User user = this.authenticationService.getCurrentUserFromSecurityContext();
        Chat chat = chatRepository.findByUrlId(chatUrlId)
                .orElseThrow(() -> new GenericEntityNotFoundException("Chat by id %s does not exist".formatted(chatUrlId)));
        return chat.getUsers().contains(user);
    }

    @Override
    public boolean isChatMember(Long chatId, Long userId) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new GenericEntityNotFoundException("Chat by id %s does not exist".formatted(chatId)));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User by id %s does not exit".formatted(userId)));
        return chat.getUsers().contains(user);
    }
}
