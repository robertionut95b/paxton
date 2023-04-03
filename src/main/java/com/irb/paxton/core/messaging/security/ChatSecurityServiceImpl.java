package com.irb.paxton.core.messaging.security;

import com.irb.paxton.core.messaging.Chat;
import com.irb.paxton.core.messaging.ChatRepository;
import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SlicedResponse;
import com.irb.paxton.exceptions.handler.common.GenericEntityNotFoundException;
import com.irb.paxton.security.SecurityUtils;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserRepository;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Slice;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service(value = "chatSecurityService")
public class ChatSecurityServiceImpl implements ChatSecurityService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChatRepository chatRepository;

    @Override
    public boolean isChatMember(Authentication authentication, PaginatedResponse<Object> response) {
        Page<Object> list = response.getList();
        return list.stream().allMatch(o -> {
            if (o instanceof Chat chat) {
                return chat
                        .getUsers()
                        .stream()
                        .anyMatch(user -> user.getUsername().equals(authentication.getName()));
            } else return false;
        });
    }

    @Override
    public boolean isChatMember(Authentication authentication, SlicedResponse<Object> response) {
        Slice<Object> list = response.getList();
        return list.stream().allMatch(o -> {
            if (o instanceof Chat chat) {
                return chat
                        .getUsers()
                        .stream()
                        .anyMatch(user -> user.getUsername().equals(authentication.getName()));
            } else return false;
        });
    }

    @Override
    public boolean isCurrentUserChatMember(Long chatId) {
        Optional<String> optionalUser = SecurityUtils.getCurrentUserLogin();
        if (optionalUser.isPresent()) {
            String currentUser = optionalUser.get();
            Chat chat = chatRepository.findById(chatId)
                    .orElseThrow(() -> new GenericEntityNotFoundException("Chat by id %s does not exist".formatted(chatId)));
            User user = userRepository.findByUsername(currentUser)
                    .orElseThrow(() -> new UserNotFoundException("User by name %s does not exit".formatted(currentUser)));
            return chat.getUsers().contains(user);
        }
        return false;
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
