package com.irb.paxton.storage;

import net.coobird.thumbnailator.Thumbnails;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.imageio.ImageIO;
import javax.servlet.ServletContext;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

import static com.irb.paxton.config.properties.ApplicationProperties.API_VERSION;

@RestController()
@RequestMapping(path = "api/" + API_VERSION)
public class FileController {

    @Autowired
    ServletContext servletContext;

    @Autowired
    FileStorageService fileStorageService;

    @GetMapping(value = "/images", produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<byte[]> getOriginalImage(@RequestParam String f) throws IOException {
        Resource image = fileStorageService.loadFileAsResource(f);
        try (InputStream in = image.getInputStream()) {
            return ResponseEntity
                    .ok().contentType(MediaType.IMAGE_JPEG)
                    .body(IOUtils.toByteArray(in));
        }
    }

    @GetMapping(value = "/images/{size}", produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<byte[]> getResizedImage(@RequestParam String f, @PathVariable String size) throws Exception {
        Resource image = fileStorageService.loadFileAsResource(f);
        InputStream in = image.getInputStream();
        BufferedImage bufferedImage = ImageIO.read(in);
        in.close();

        int[] sizes = fileStorageService.splitStringSizesParameter(size);
        BufferedImage bufferedImg = Thumbnails.of(bufferedImage)
                .size(sizes[0], sizes[1])
                .outputFormat("jpg")
                .asBufferedImage();

        ByteArrayOutputStream outStream = new ByteArrayOutputStream();
        ImageIO.write(bufferedImg, "jpg", outStream);
        InputStream is = new ByteArrayInputStream(outStream.toByteArray());

        return ResponseEntity
                .ok().contentType(MediaType.IMAGE_JPEG)
                .body(IOUtils.toByteArray(is));
    }
}
