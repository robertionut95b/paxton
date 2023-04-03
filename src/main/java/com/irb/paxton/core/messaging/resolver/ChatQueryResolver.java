package com.irb.paxton.core.messaging.resolver;

import com.irb.paxton.core.messaging.Chat;
import com.irb.paxton.core.messaging.ChatService;
import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SearchRequest;
import graphql.kickstart.tools.GraphQLQueryResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import java.util.Collection;

@Controller
public class ChatQueryResolver implements GraphQLQueryResolver {

    @Autowired
    private ChatService chatService;

    public Chat getPrivateChatById(Long chatId) {
        return chatService.getPrivateChatById(chatId);
    }

    public Collection<Chat> getPrivateChatsByUserId(Long userId, String msgSearch) {
        return chatService.findPrivateChatsByUserId(userId, msgSearch);
    }

    public PaginatedResponse<Chat> getChatAdvSearch(SearchRequest searchRequest) {
        return chatService.getChatAdvSearch(searchRequest);
    }
}
