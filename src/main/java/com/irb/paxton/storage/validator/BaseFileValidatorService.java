package com.irb.paxton.storage.validator;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public abstract class BaseFileValidatorService implements FileValidator {

    @Override
    public boolean checkFileMimeType(MultipartFile file, String mimeType) {
        String contentType = file.getContentType();
        if (contentType == null) return false;
        return contentType.equals(mimeType);
    }

    @Override
    public boolean checkFileMimeType(MultipartFile file, List<String> mimeType) {
        return mimeType.stream()
                .anyMatch(m -> this.checkFileMimeType(file, m));
    }
}
