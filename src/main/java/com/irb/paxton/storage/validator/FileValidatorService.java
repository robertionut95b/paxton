package com.irb.paxton.storage.validator;

import org.apache.commons.io.FilenameUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Objects;

@Service
public class FileValidatorService implements FileValidator {

    @Override
    public boolean checkFileMimeType(MultipartFile file, String mimeType) {
        return Objects
                .requireNonNull(FilenameUtils
                        .getExtension(file.getOriginalFilename()))
                .equalsIgnoreCase(mimeType);
    }

    @Override
    public boolean checkFileMimeType(MultipartFile file, List<String> mimeType) {
        return mimeType.stream()
                .anyMatch(m -> this.checkFileMimeType(file, m));
    }
}
