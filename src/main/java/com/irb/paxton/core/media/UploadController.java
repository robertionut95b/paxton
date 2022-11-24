package com.irb.paxton.core.media;

import com.irb.paxton.core.media.input.PhotographyInput;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.io.IOException;

import static com.irb.paxton.config.ApplicationProperties.API_VERSION;

@RestController
@Slf4j
@Validated
@RequestMapping(path = "api/" + API_VERSION + "/users")
public class UploadController {

    @Autowired
    private PhotographyService photographyService;

    @PostMapping(path = "/upload/profile-banner")
    public Photography changeProfileBanner(@NotNull @Valid PhotographyInput photographyInput) throws IOException {
        return this.photographyService.changeProfileBanner(photographyInput);
    }

    @PostMapping(path = "/upload/profile-avatar")
    public Photography changeProfileAvatar(@NotNull @Valid PhotographyInput photographyInput) throws IOException {
        return this.photographyService.changeProfileAvatar(photographyInput);
    }
}
