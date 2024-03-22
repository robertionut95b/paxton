package com.irb.paxton.storage.validator;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class DocumentFileValidatorService extends BaseFileValidatorService {

    @Override
    public boolean checkIsValid(MultipartFile file) {
        return this.checkFileMimeType(file, MediaType.APPLICATION_PDF_VALUE);
    }
}
