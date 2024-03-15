package com.irb.paxton.core.messaging.jpalisteners;

import com.irb.paxton.core.messaging.Message;
import com.irb.paxton.core.messaging.MessageFile;
import com.irb.paxton.storage.BucketStorageService;
import com.irb.paxton.storage.StorageService;
import com.irb.paxton.storage.exception.PaxtonMinioException;
import jakarta.persistence.PostLoad;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class MessageFileEntityListener {

    private final StorageService storageService;

    @PostLoad
    private void postLoad(MessageFile file) {
        Message msg = file.getMessage();
        if (storageService instanceof BucketStorageService<?>) {
            // get image url from storage S3 service
            try {
                file.setUrl(((BucketStorageService<?>) storageService).getPresignedUrlByObject(file.getPath()));
            } catch (PaxtonMinioException e) {
                file.setUrl(null);
            }
        } else
            file.setUrl("api/v1/chats/%s/messages/%s/uploads/%s".formatted(msg.getChat().getId(), msg.getId(), file.getName()));
    }
}
