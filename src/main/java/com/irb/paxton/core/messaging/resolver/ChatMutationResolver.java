package com.irb.paxton.core.messaging.resolver;

import com.irb.paxton.core.messaging.ChatService;
import com.irb.paxton.core.messaging.dto.ChatResponseDto;
import com.irb.paxton.core.messaging.input.ChatInput;
import com.irb.paxton.core.messaging.input.MessageFileInput;
import com.irb.paxton.core.messaging.input.MessageInput;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.InputArgument;
import graphql.schema.DataFetchingEnvironment;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@DgsComponent
public class ChatMutationResolver {

    private final ChatService chatService;

    public ChatMutationResolver(ChatService chatService) {
        this.chatService = chatService;
    }

    @DgsMutation
    public ChatResponseDto addMessageToChat(@InputArgument MessageInput MessageInput) {
        return chatService.addMessageToChat(MessageInput);
    }

    @DgsMutation
    public ChatResponseDto addMessageWithFileToChat(@InputArgument MessageFileInput messageInput, DataFetchingEnvironment dfe) {
        // get file as Multipart type
        List<MultipartFile> file = dfe.getArgument("fileUpload");
        if (file.isEmpty())
            throw new IllegalArgumentException("File upload cannot be empty");
        return chatService.addMessageToChatWithFileUpload(messageInput, file);
    }

    @DgsMutation
    public ChatResponseDto createChat(@InputArgument ChatInput ChatInput) {
        return chatService.createChat(ChatInput);
    }

    @DgsMutation
    public ChatResponseDto updateChat(@InputArgument ChatInput ChatInput) {
        return chatService.updateChat(ChatInput);
    }

    @DgsMutation
    public ChatResponseDto removeChat(@InputArgument Long chatId) {
        return chatService.removeChatById(chatId);
    }

    @DgsMutation
    public ChatResponseDto markAllMessagesAsSeen(@InputArgument Long chatId, @InputArgument Long userId) {
        return chatService.markAllMessagesAsSeen(chatId, userId);
    }
}
