package com.irb.paxton.core.profile.listener;

import com.irb.paxton.core.profile.avatar.UserProfileAvatarImage;
import com.irb.paxton.storage.BucketStorageService;
import com.irb.paxton.storage.StorageService;
import com.irb.paxton.storage.exception.PaxtonMinioException;
import jakarta.persistence.PostLoad;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import static com.irb.paxton.config.properties.ApplicationProperties.API_VERSION;

@Component
@Slf4j
@RequiredArgsConstructor
public class AvatarImageUrlServiceableListener {

    private final StorageService storageService;

    @PostLoad
    private void postLoad(UserProfileAvatarImage image) {
        if (storageService instanceof BucketStorageService<?>) {
            // get image url from storage S3 service
            try {
                image.setUrl(((BucketStorageService<?>) storageService).getPresignedUrlByObject(image.getPath()));
            } catch (PaxtonMinioException e) {
                image.setUrl(null);
            }
        } else
            image.setUrl("api/%s/users/avatars/%s".formatted(API_VERSION, image.getName()));
    }
}
