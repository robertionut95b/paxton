package com.irb.paxton.core.profile.banner;

import com.irb.paxton.core.model.storage.File;
import com.irb.paxton.core.profile.input.PhotographyInput;
import com.irb.paxton.storage.FileServingService;
import com.irb.paxton.storage.exception.FileNotFoundException;
import com.irb.paxton.storage.validator.ImageFileValidatorService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLConnection;
import java.util.Locale;
import java.util.Optional;

import static com.irb.paxton.config.properties.ApplicationProperties.API_VERSION;

@RestController
@Slf4j
@Validated
@RequiredArgsConstructor
@RequestMapping(path = "api/" + API_VERSION + "/users")
public class UserProfileBannerImageController {

    private final ImageFileValidatorService imageFileValidatorService;

    private final UserProfileBannerImageService userProfileBannerImageService;

    private final FileServingService fileServingService;

    private final MessageSource messageSource;

    @PostMapping(path = "{userId}/upload/banner")
    public UserProfileBannerImage changeProfileBanner(@PathVariable Long userId, @NotNull @Valid PhotographyInput photographyInput) throws IOException {
        photographyInput.setUserId(userId);
        if (!imageFileValidatorService.checkIsValid(photographyInput.getPhotography())) {
            throw new IllegalArgumentException(messageSource.getMessage("px.application.image.supportedFormats", null, Locale.getDefault()));
        }
        return this.userProfileBannerImageService.changeProfileBanner(photographyInput);
    }

    @GetMapping(value = "/banners/{imageName}")
    public ResponseEntity<byte[]> getProfileBannerImage(@PathVariable String imageName, @RequestParam(required = false) Optional<String> size) {
        File file = this.userProfileBannerImageService
                .findByNameOptional(imageName)
                .orElseThrow(() -> new FileNotFoundException("File does not exist"));
        if (size.isPresent()) {
            byte[] fileBytes = this.fileServingService
                    .serveResizableImageByFileNameAndSize(file, size.get());
            return ResponseEntity
                    .ok()
                    .contentType(MediaType.parseMediaType(URLConnection.guessContentTypeFromName(imageName)))
                    .body(fileBytes);
        }
        byte[] fileBytes = this.fileServingService
                .serveFileByFileName(file);
        return ResponseEntity
                .ok()
                .contentType(MediaType.parseMediaType(URLConnection.guessContentTypeFromName(imageName)))
                .body(fileBytes);
    }
}
