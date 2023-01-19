package com.irb.paxton.core.media;

import com.irb.paxton.core.media.input.PhotographyInput;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.imageio.ImageIO;
import javax.servlet.ServletContext;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.io.IOException;
import java.io.InputStream;

import static com.irb.paxton.config.properties.ApplicationProperties.API_VERSION;

@RestController
@Slf4j
@Validated
@RequestMapping(path = "api/" + API_VERSION + "/users")
public class UploadController {

    @Autowired
    private PhotographyService photographyService;

    @Autowired
    private ServletContext servletContext;

    @PostMapping(path = "/upload/profile-banner")
    public Photography changeProfileBanner(@NotNull @Valid PhotographyInput photographyInput) throws IOException {
        try (InputStream in = photographyInput.getPhotography().getInputStream()) {
            if (ImageIO.read(in) == null) {
                throw new IllegalArgumentException("Input is not image");
            }
            String mimeType = servletContext.getMimeType(photographyInput.getPhotography().getOriginalFilename());
            if (!mimeType.startsWith("image/jpg") && !mimeType.startsWith("image/jpeg")) {
                throw new IllegalArgumentException("Unsupported image format - jpg/jpeg allowed only");
            }
        }
        return this.photographyService.changeProfileBanner(photographyInput);
    }

    @PostMapping(path = "/upload/profile-avatar")
    public Photography changeProfileAvatar(@NotNull @Valid PhotographyInput photographyInput) throws IOException {
        try (InputStream in = photographyInput.getPhotography().getInputStream()) {
            if (ImageIO.read(in) == null) {
                throw new IllegalArgumentException("Input is not image");
            }
            String mimeType = servletContext.getMimeType(photographyInput.getPhotography().getOriginalFilename());
            if (!mimeType.startsWith("image/jpg") && !mimeType.startsWith("image/jpeg")) {
                throw new IllegalArgumentException("Unsupported image format - jpg/jpeg allowed only");
            }
        }
        return this.photographyService.changeProfileAvatar(photographyInput);
    }
}
