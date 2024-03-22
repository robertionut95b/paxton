package com.irb.paxton.core.messaging.resolver;

import com.irb.paxton.core.messaging.ChatService;
import com.irb.paxton.core.messaging.dto.ChatResponseDto;
import com.irb.paxton.core.messaging.input.ChatInput;
import com.irb.paxton.core.messaging.input.MessageFileInput;
import com.irb.paxton.core.messaging.input.MessageInput;
import com.irb.paxton.storage.validator.DocumentFileValidatorService;
import com.irb.paxton.storage.validator.ImageFileValidatorService;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.InputArgument;
import graphql.schema.DataFetchingEnvironment;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Locale;

@DgsComponent
@RequiredArgsConstructor
public class ChatMutationResolver {

    private final ChatService chatService;

    private final ImageFileValidatorService imageFileValidatorService;

    private final DocumentFileValidatorService documentFileValidatorService;

    private final MessageSource messageSource;

    @DgsMutation
    public ChatResponseDto addMessageToChat(@InputArgument MessageInput MessageInput) {
        return chatService.addMessageToChat(MessageInput);
    }

    @DgsMutation
    public ChatResponseDto addMessageWithFileToChat(@InputArgument MessageFileInput messageInput, DataFetchingEnvironment dfe) {
        // get file as Multipart type
        List<MultipartFile> files = dfe.getArgument("fileUpload");
        if (files.isEmpty())
            throw new IllegalArgumentException("File upload cannot be empty");
        if (files.stream().noneMatch(uploadFile -> imageFileValidatorService.checkIsValid(uploadFile) || documentFileValidatorService.checkIsValid(uploadFile))) {
            throw new IllegalArgumentException(messageSource.getMessage("px.application.files.supportedFormats", null, Locale.getDefault()));
        }
        return chatService.addMessageToChatWithFileUpload(messageInput, files);
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
