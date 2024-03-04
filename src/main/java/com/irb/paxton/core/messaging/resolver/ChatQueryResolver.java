package com.irb.paxton.core.messaging.resolver;

import com.irb.paxton.core.messaging.Chat;
import com.irb.paxton.core.messaging.ChatService;
import com.irb.paxton.core.messaging.dto.ChatResponseDto;
import com.irb.paxton.core.messaging.type.ChatType;
import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SearchRequest;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;

import java.util.List;

@DgsComponent
public class ChatQueryResolver {

    private final ChatService chatService;

    public ChatQueryResolver(ChatService chatService) {
        this.chatService = chatService;
    }

    @DgsQuery
    public ChatResponseDto getPrivateChatById(@InputArgument Long chatId) {
        return chatService.getPrivateChatById(chatId);
    }

    @DgsQuery
    public ChatResponseDto getPrivateChatByUrlId(@InputArgument String chatUrlId) {
        return chatService.getPrivateChatByUrlId(chatUrlId);
    }

    @DgsQuery
    public PaginatedResponse<Chat> getChatAdvSearch(@InputArgument SearchRequest searchQuery) {
        return chatService.getChatAdvSearch(searchQuery);
    }

    @DgsQuery
    public ChatResponseDto getChatWithUserId(@InputArgument Long userId) {
        return chatService.getChatWithUserId(userId);
    }

    @DgsQuery
    public List<ChatResponseDto> getChatsWithUsersIds(@InputArgument List<Long> userIds, @InputArgument ChatType chatType) {
        return chatService.getChatsWithUsersIds(userIds, chatType);
    }
}
