package com.irb.paxton.core.media.input;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotNull;

@Data
public class PhotographyInput {

    @NotNull
    public MultipartFile photography;

    @NotNull
    public Long userId;
}
