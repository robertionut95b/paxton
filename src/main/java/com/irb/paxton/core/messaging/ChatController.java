package com.irb.paxton.core.messaging;

import com.irb.paxton.core.media.validator.ValidFile;
import com.irb.paxton.core.messaging.dto.ChatResponseDto;
import com.irb.paxton.core.messaging.input.MessageFileInput;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserService;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import com.irb.paxton.storage.validator.DocumentFileValidatorService;
import com.irb.paxton.storage.validator.ImageFileValidatorService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;
import java.util.Locale;

import static com.irb.paxton.config.properties.ApplicationProperties.API_VERSION;

@RestController
@Slf4j
@Validated
@RequiredArgsConstructor
@RequestMapping(path = "api/" + API_VERSION + "/chats")
public class ChatController {

    private final ChatService chatService;

    private final UserService userService;

    private final ImageFileValidatorService imageFileValidatorService;

    private final DocumentFileValidatorService documentFileValidatorService;

    private final MessageSource messageSource;

    @PostMapping(path = "{chatId}/messages")
    public ChatResponseDto addMessageWithFileToChat(@PathVariable Long chatId, @Valid @ValidFile @RequestBody @NotNull @NotEmpty List<MultipartFile> uploadFiles, Principal principal) {
        User user = userService
                .findByUsername(principal.getName())
                .orElseThrow(() -> new UserNotFoundException("User does not exist"));
        if (uploadFiles.stream().noneMatch(uploadFile -> imageFileValidatorService.checkIsValid(uploadFile) || documentFileValidatorService.checkIsValid(uploadFile))) {
            throw new IllegalArgumentException(messageSource.getMessage("px.application.files.supportedFormats", null, Locale.getDefault()));
        }
        return chatService.addMessageToChatWithFileUpload(new MessageFileInput(null, user.getId(), chatId), uploadFiles);
    }
}
