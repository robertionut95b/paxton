package com.irb.paxton.storage.validator;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FileValidator {

    boolean checkFileMimeType(MultipartFile file, String mimeType);

    boolean checkFileMimeType(MultipartFile file, List<String> mimeType);
}
