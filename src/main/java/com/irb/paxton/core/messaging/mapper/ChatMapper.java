package com.irb.paxton.core.messaging.mapper;

import com.irb.paxton.core.messaging.Chat;
import com.irb.paxton.core.messaging.dto.ChatLiveUpdateDto;
import com.irb.paxton.core.messaging.dto.ChatResponseDto;
import com.irb.paxton.core.messaging.input.ChatInput;
import com.irb.paxton.core.model.mapper.ReferenceMapper;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring",
        injectionStrategy = InjectionStrategy.CONSTRUCTOR, uses = {MessageMapper.class, ReferenceMapper.class})
public abstract class ChatMapper {

    @Mapping(target = "chatType", source = "chatInput.chatType")
    public abstract Chat toEntity(ChatInput chatInput);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "chatType", source = "chatInput.chatType")
    public abstract Chat partialUpdate(ChatInput chatInput, @MappingTarget Chat chat);

    public abstract ChatLiveUpdateDto toChatLiveUpdateDto(Chat chat);

    public abstract ChatResponseDto toChatResponseDto(Chat chat);

    public abstract Chat chatResponseDtoToChat(ChatResponseDto chatResponseDto);
}