package com.irb.paxton.storage.validator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import javax.servlet.ServletContext;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Service
public class ImageFileValidatorService implements ImageFileValidator {

    @Autowired
    ServletContext servletContext;

    @Override
    public boolean checkFileMimeType(MultipartFile file, String mimeType) {
        return servletContext
                .getMimeType(file.getOriginalFilename()).startsWith(mimeType);
    }

    @Override
    public boolean checkFileMimeType(MultipartFile file, List<String> mimeType) {
        return mimeType.stream()
                .allMatch(m -> this.checkFileMimeType(file, m));
    }

    @Override
    public boolean checkIsImage(MultipartFile file) throws IOException {
        try (InputStream inputStream = file.getInputStream()) {
            if (ImageIO.read(inputStream) == null) {
                // input is not image
                return false;
            }
        }
        return true;
    }
}
