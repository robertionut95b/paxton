package com.irb.paxton.core.candidate.documents.input;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotNull;

@Data
public class ApplicationDocumentInput {

    @NotNull
    public MultipartFile files;
}
