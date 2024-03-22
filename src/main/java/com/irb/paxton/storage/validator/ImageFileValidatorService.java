package com.irb.paxton.storage.validator;

import com.irb.paxton.exceptions.handler.common.PaxtonValidationException;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Service
public class ImageFileValidatorService extends BaseFileValidatorService {

    protected boolean checkIsImage(MultipartFile file) throws IOException {
        try (InputStream inputStream = file.getInputStream()) {
            if (ImageIO.read(inputStream) == null) {
                // input is not image
                return false;
            }
        }
        return this.checkFileMimeType(file, List.of(
                MediaType.IMAGE_JPEG_VALUE,
                "image/jpg",
                MediaType.IMAGE_PNG_VALUE
        ));
    }

    @Override
    public boolean checkIsValid(MultipartFile file) {
        try {
            return this.checkIsImage(file);
        } catch (IOException e) {
            throw new PaxtonValidationException("Could not validate file", e);
        }
    }
}
