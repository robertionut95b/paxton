package com.irb.paxton.core.messaging.resolver;

import com.irb.paxton.core.messaging.Chat;
import com.irb.paxton.core.messaging.ChatService;
import com.irb.paxton.core.messaging.input.ChatInput;
import com.irb.paxton.core.messaging.input.MessageInput;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.InputArgument;
import org.springframework.beans.factory.annotation.Autowired;

@DgsComponent
public class ChatMutationResolver {

    @Autowired
    private ChatService chatService;

    @DgsMutation
    public Chat addMessageToChat(@InputArgument MessageInput MessageInput) {
        return chatService.addMessageToChat(MessageInput);
    }

    @DgsMutation
    public Chat createChat(@InputArgument ChatInput ChatInput) {
        return chatService.createChat(ChatInput);
    }

    @DgsMutation
    public Chat updateChat(@InputArgument ChatInput ChatInput) {
        return chatService.updateChat(ChatInput);
    }

    @DgsMutation
    public Chat removeChat(@InputArgument Long chatId) {
        return chatService.removeChatById(chatId);
    }

    @DgsMutation
    public Chat markAllMessagesAsSeen(@InputArgument Long chatId, @InputArgument Long userId) {
        return chatService.markAllMessagesAsSeen(chatId, userId);
    }
}
