package com.irb.paxton.core.messaging.mapper;

import com.irb.paxton.core.messaging.Message;
import com.irb.paxton.core.messaging.MessageRepository;
import com.irb.paxton.core.messaging.MessageSeenBy;
import com.irb.paxton.core.messaging.input.MessageSeenByInput;
import com.irb.paxton.core.model.mapper.ReferenceMapper;
import com.irb.paxton.exceptions.handler.common.GenericEntityNotFoundException;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserRepository;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring",
        injectionStrategy = InjectionStrategy.CONSTRUCTOR, uses = {ReferenceMapper.class})
public abstract class MessageSeenByMapper {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Mapping(target = "message", source = "messageSeenByInput.messageId")
    @Mapping(target = "user", source = "messageSeenByInput.messageId")
    public abstract MessageSeenBy toEntity(MessageSeenByInput messageSeenByInput);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    public abstract MessageSeenBy partialUpdate(MessageSeenByInput messageSeenByInput, @MappingTarget MessageSeenBy messageSeenBy);

    public User mapUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User by id %s does not exist".formatted(userId)));
    }

    public Message mapMessage(Long messageId) {
        return messageRepository.findById(messageId)
                .orElseThrow(() -> new GenericEntityNotFoundException("Message by id %s does not exist".formatted(messageId)));
    }
}