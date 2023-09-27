package com.irb.paxton.core.media;

import com.irb.paxton.storage.FileStorageService;
import net.coobird.thumbnailator.Thumbnails;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import static com.irb.paxton.config.properties.ApplicationProperties.API_VERSION;

@RestController
@RequestMapping(path = "api/" + API_VERSION)
public class PhotographyController {

    @Autowired
    FileStorageService fileStorageService;

    @Autowired
    PhotographyService photographyService;

    public int[] splitStringSizesParameter(String size) {
        String[] sizes = size.split("x");
        if (sizes.length != 2) {
            throw new IllegalArgumentException("Image sizes must be valid");
        }
        int width = Integer.parseInt(sizes[0]);
        int height = Integer.parseInt(sizes[1]);
        return new int[]{width, height};
    }

    @GetMapping(value = {"/images/{size}/{imageName}", "/images/{imageName}"}, produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<byte[]> getImage(@PathVariable(required = false) Optional<String> size, @PathVariable String imageName) throws IOException {
        Photography photography = photographyService.findByName(imageName);
        Resource image = fileStorageService.loadAsResourceFromFullPath(photography.getPath());
        CacheControl cacheControl = CacheControl.maxAge(60, TimeUnit.SECONDS).noTransform().mustRevalidate();
        if (size.isEmpty()) {
            try (InputStream in = image.getInputStream()) {
                return ResponseEntity
                        .ok().contentType(MediaType.IMAGE_JPEG)
                        .cacheControl(cacheControl)
                        .body(IOUtils.toByteArray(in));
            }
        } else {
            InputStream in = image.getInputStream();
            BufferedImage bufferedImage = ImageIO.read(in);
            in.close();

            int[] sizes = this.splitStringSizesParameter(size.get());
            BufferedImage bufferedImg = Thumbnails.of(bufferedImage)
                    .size(sizes[0], sizes[1])
                    .outputFormat("jpg")
                    .asBufferedImage();

            ByteArrayOutputStream outStream = new ByteArrayOutputStream();
            ImageIO.write(bufferedImg, "jpg", outStream);
            InputStream is = new ByteArrayInputStream(outStream.toByteArray());

            return ResponseEntity
                    .ok().contentType(MediaType.IMAGE_JPEG)
                    .cacheControl(cacheControl)
                    .body(IOUtils.toByteArray(is));
        }
    }
}
