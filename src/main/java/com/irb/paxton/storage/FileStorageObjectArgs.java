package com.irb.paxton.storage;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Builder
@Getter
@Setter
public class FileStorageObjectArgs {

    private final String fileName;

    private final String[] filePath;

    @NotNull
    private final MultipartFile multipartFile;
}
