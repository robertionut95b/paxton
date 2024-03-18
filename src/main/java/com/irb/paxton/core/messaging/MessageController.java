package com.irb.paxton.core.messaging;

import com.irb.paxton.core.model.storage.File;
import com.irb.paxton.storage.FileServingService;
import com.irb.paxton.storage.exception.FileNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.net.URLConnection;
import java.util.Optional;

import static com.irb.paxton.config.properties.ApplicationProperties.API_VERSION;

@RestController
@Slf4j
@Validated
@RequiredArgsConstructor
@RequestMapping(path = "api/" + API_VERSION + "/chats")
public class MessageController {

    private final MessageFileService messageFileService;

    private final FileServingService fileServingService;

    @GetMapping(path = "{chatId}/messages/{messageId}")
    public ResponseEntity<byte[]> getMessageFile(@PathVariable Long chatId, @PathVariable Long messageId, @PathVariable String fileName, @RequestParam(required = false) Optional<String> size) {
        File file = this.messageFileService
                .findByChatIdMessageIdAndFileNameOpt(chatId, messageId, fileName)
                .orElseThrow(() -> new FileNotFoundException("File does not exist"));
        if (size.isPresent()) {
            byte[] fileBytes = this.fileServingService
                    .serveResizableImageByFileNameAndSize(file, size.get());
            return ResponseEntity
                    .ok()
                    .contentType(MediaType.parseMediaType(URLConnection.guessContentTypeFromName(fileName)))
                    .body(fileBytes);
        }
        byte[] fileBytes = this.fileServingService
                .serveFileByFileName(file);
        return ResponseEntity
                .ok()
                .contentType(MediaType.parseMediaType(URLConnection.guessContentTypeFromName(fileName)))
                .body(fileBytes);
    }
}
