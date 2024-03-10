package com.irb.paxton.core.media;

import com.irb.paxton.storage.StorageService;
import com.irb.paxton.utils.Base64Utils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.InputStream;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import static com.irb.paxton.config.properties.ApplicationProperties.API_VERSION;

@RestController
@RequestMapping(path = "api/" + API_VERSION)
public class PhotographyController {

    private final StorageService storageService;

    private final PhotographyService photographyService;

    public PhotographyController(StorageService storageService, PhotographyService photographyService) {
        this.storageService = storageService;
        this.photographyService = photographyService;
    }

    @GetMapping(value = {"/images/{size}/{imageName}", "/images/{imageName}"}, produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<byte[]> getImage(@PathVariable(required = false) Optional<String> size, @PathVariable String imageName) throws IOException {
        Resource image;
        if (Base64Utils.checkIsBase64(imageName)) {
            image = new ByteArrayResource(photographyService.getFromExternalUrlIfBase64(imageName));
        } else {
            Photography photography = photographyService.findByName(imageName);
            image = storageService.loadAsResourceFromPath(photography.getPath());
        }
        CacheControl cacheControl = CacheControl.maxAge(60, TimeUnit.SECONDS).noTransform().mustRevalidate();
        if (size.isEmpty()) {
            try (InputStream in = image.getInputStream()) {
                return ResponseEntity
                        .ok().contentType(MediaType.IMAGE_JPEG)
                        .cacheControl(cacheControl)
                        .body(IOUtils.toByteArray(in));

            }
        }
        InputStream is = ImageProcessor.resizeImageToInputStream(image, size.get(), FilenameUtils.getExtension(imageName));
        return ResponseEntity
                .ok().contentType(MediaType.IMAGE_JPEG)
                .cacheControl(cacheControl)
                .body(IOUtils.toByteArray(is));
    }
}
