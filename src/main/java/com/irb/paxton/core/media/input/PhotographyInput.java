package com.irb.paxton.core.media.input;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Data
public class PhotographyInput {

    @NotNull
    public MultipartFile photography;

    @NotNull
    @NotEmpty
    @NotBlank
    public String userProfileSlugUrl;
}
