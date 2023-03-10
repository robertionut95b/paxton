package com.irb.paxton.storage.validator;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ImageFileValidator extends FileValidator {

    boolean checkIsImage(MultipartFile file) throws IOException;
}
