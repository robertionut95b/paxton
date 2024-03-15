package com.irb.paxton.core.profile.input;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class PhotographyInput {

    @NotNull
    public MultipartFile photography;

    @NotNull
    public Long userId;
}
