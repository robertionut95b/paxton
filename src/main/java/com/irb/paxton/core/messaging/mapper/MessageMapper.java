package com.irb.paxton.core.messaging.mapper;

import com.irb.paxton.core.messaging.Chat;
import com.irb.paxton.core.messaging.ChatRepository;
import com.irb.paxton.core.messaging.Message;
import com.irb.paxton.core.messaging.input.MessageFileInput;
import com.irb.paxton.core.messaging.input.MessageInput;
import com.irb.paxton.core.model.mapper.ReferenceMapper;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserRepository;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring",
        injectionStrategy = InjectionStrategy.CONSTRUCTOR, uses = {ReferenceMapper.class})
public abstract class MessageMapper {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserRepository userRepository;

    @Mapping(target = "chat", source = "messageInput.chatId")
    @Mapping(target = "sender", source = "messageInput.senderUserId")
    public abstract Message toEntity(MessageInput messageInput);

    @Mapping(target = "chat", source = "messageFileInput.chatId")
    @Mapping(target = "sender", source = "messageFileInput.senderUserId")
    public abstract Message toEntity(MessageFileInput messageFileInput);

    @Mapping(target = "chat", source = "messageInput.chatId")
    @Mapping(target = "sender", source = "messageInput.senderUserId")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    public abstract Message partialUpdate(MessageInput messageInput, @MappingTarget Message message);

    public Chat mapChat(Long chatId) {
        return this.chatRepository.findById(chatId)
                .orElseThrow(() -> new IllegalArgumentException("Chat by id %s does not exist".formatted(chatId)));
    }

    public User mapUser(Long userId) {
        return this.userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User by id %s does not exist".formatted(userId)));
    }
}