package com.irb.paxton.core.profile.banner;

import com.irb.paxton.core.profile.input.PhotographyInput;
import com.irb.paxton.storage.FileServingService;
import com.irb.paxton.storage.validator.ImageFileValidatorService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLConnection;
import java.util.List;
import java.util.Optional;

import static com.irb.paxton.config.properties.ApplicationProperties.API_VERSION;

@RestController
@Slf4j
@Validated
@RequiredArgsConstructor
@RequestMapping(path = "api/" + API_VERSION + "/users")
public class UserProfileBannerImageController {

    private final UserProfileBannerImageService userProfileBannerImageService;

    private final FileServingService fileServingService;

    private final ImageFileValidatorService imageFileValidatorService;

    @PostMapping(path = "{userId}/upload/banner")
    public UserProfileBannerImage changeProfileBanner(@PathVariable Long userId, @NotNull @Valid PhotographyInput photographyInput) throws IOException {
        photographyInput.setUserId(userId);
        if (!imageFileValidatorService.checkIsImage(photographyInput.getPhotography())) {
            throw new IllegalArgumentException("Input is not image");
        }
        if (imageFileValidatorService.checkFileMimeType(photographyInput.getPhotography(), List.of("image/jpg", "image/jpeg"))) {
            throw new IllegalArgumentException("Unsupported image format - jpg/jpeg allowed only");
        }
        return this.userProfileBannerImageService.changeProfileBanner(photographyInput);
    }

    @GetMapping(value = "/banners/{imageName}")
    public ResponseEntity<byte[]> getProfileBannerImage(@PathVariable String imageName, @RequestParam(required = false) Optional<String> size) {
        if (size.isPresent()) {
            byte[] fileBytes = this.fileServingService
                    .serveResizableImageByFileNameAndSize(imageName, size.get());
            return ResponseEntity
                    .ok()
                    .contentType(MediaType.parseMediaType(URLConnection.guessContentTypeFromName(imageName)))
                    .body(fileBytes);
        }
        byte[] fileBytes = this.fileServingService
                .serveFileByFileName(imageName);
        return ResponseEntity
                .ok()
                .contentType(MediaType.parseMediaType(URLConnection.guessContentTypeFromName(imageName)))
                .body(fileBytes);
    }
}
