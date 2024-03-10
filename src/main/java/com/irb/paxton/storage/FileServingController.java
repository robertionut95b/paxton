package com.irb.paxton.storage;

import com.irb.paxton.storage.validator.ImageFileValidatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URLConnection;

import static com.irb.paxton.config.properties.ApplicationProperties.API_VERSION;

@RestController
@RequestMapping(path = "api/" + API_VERSION + "/uploads")
@RequiredArgsConstructor
public class FileServingController {

    private final FileServingService fileServingService;

    private final ImageFileValidatorService imageFileValidatorService;

    @GetMapping(value = {"/files/{fileName}"})
    private ResponseEntity<byte[]> getFileByName(@PathVariable String fileName) {
        return ResponseEntity
                .ok(fileServingService.serveFileByFileName(fileName));
    }

    @GetMapping(value = {"/images/{size}/{imageFileName}", "/images/{imageFileName}"})
    private ResponseEntity<byte[]> getResizableImage(@PathVariable(required = false) String size, @PathVariable String imageFileName) {
        if (size != null) {
            byte[] fileBytes = this.fileServingService.serveResizableImageByFileNameAndSize(imageFileName, size);
            return ResponseEntity
                    .ok()
                    .contentType(MediaType.parseMediaType(URLConnection.guessContentTypeFromName(imageFileName)))
                    .body(fileBytes);
        }
        byte[] fileBytes = this.fileServingService.serveFileByFileName(imageFileName);
        return ResponseEntity
                .ok()
                .contentType(MediaType.parseMediaType(URLConnection.guessContentTypeFromName(imageFileName)))
                .body(fileBytes);
    }
}
