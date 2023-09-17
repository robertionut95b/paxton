package com.irb.paxton.core.messaging.resolver;

import com.irb.paxton.core.messaging.Chat;
import com.irb.paxton.core.messaging.ChatService;
import com.irb.paxton.core.messaging.input.ChatInput;
import com.irb.paxton.core.messaging.input.MessageInput;
import graphql.kickstart.tools.GraphQLMutationResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class ChatMutationResolver implements GraphQLMutationResolver {

    @Autowired
    private ChatService chatService;

    public Chat addMessageToChat(MessageInput messageInput) {
        return chatService.addMessageToChat(messageInput);
    }

    public Chat createChat(ChatInput chatInput) {
        return chatService.createChat(chatInput);
    }

    public Chat updateChat(ChatInput chatInput) {
        return chatService.updateChat(chatInput);
    }

    public Chat removeChat(Long chatId) {
        return chatService.removeChatById(chatId);
    }

    public Chat markAllMessagesAsSeen(Long chatId, Long userId) {
        return chatService.markAllMessagesAsSeen(chatId, userId);
    }
}
