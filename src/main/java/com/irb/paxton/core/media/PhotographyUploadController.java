package com.irb.paxton.core.media;

import com.irb.paxton.core.media.input.PhotographyInput;
import com.irb.paxton.storage.validator.ImageFileValidatorService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.io.IOException;
import java.util.List;

import static com.irb.paxton.config.properties.ApplicationProperties.API_VERSION;

@RestController
@Slf4j
@Validated
@RequestMapping(path = "api/" + API_VERSION + "/users")
public class PhotographyUploadController {

    @Autowired
    private PhotographyService photographyService;

    @Autowired
    private ImageFileValidatorService imageFileValidatorService;

    @PostMapping(path = "{userId}/upload/banner")
    public Photography changeProfileBanner(@PathVariable(value = "userId") Long userId, @NotNull @Valid PhotographyInput photographyInput) throws IOException {
        photographyInput.setUserId(userId);
        if (!imageFileValidatorService.checkIsImage(photographyInput.getPhotography())) {
            throw new IllegalArgumentException("Input is not image");
        }
        if (imageFileValidatorService.checkFileMimeType(photographyInput.getPhotography(), List.of("image/jpg", "image/jpeg"))) {
            throw new IllegalArgumentException("Unsupported image format - jpg/jpeg allowed only");
        }
        return this.photographyService.changeProfileBanner(photographyInput);
    }

    @PostMapping(path = "{userId}/upload/avatar")
    public Photography changeProfileAvatar(@PathVariable(value = "userId") Long userId, @NotNull @Valid PhotographyInput photographyInput) throws IOException {
        photographyInput.setUserId(userId);
        if (!imageFileValidatorService.checkIsImage(photographyInput.getPhotography())) {
            throw new IllegalArgumentException("Input is not image");
        }
        if (imageFileValidatorService.checkFileMimeType(photographyInput.getPhotography(), List.of("image/jpg", "image/jpeg"))) {
            throw new IllegalArgumentException("Unsupported image format - jpg/jpeg allowed only");
        }
        return this.photographyService.changeProfileAvatar(photographyInput);
    }
}
