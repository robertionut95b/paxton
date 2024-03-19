package com.irb.paxton.core.media;

import net.coobird.thumbnailator.Thumbnails;
import org.apache.commons.io.FilenameUtils;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

public class ImageProcessingUtils {

    private ImageProcessingUtils() {
    }

    public static int[] splitStringSizesParameter(String size) {
        String[] sizes = size.split("x");
        if (sizes.length != 2) {
            throw new IllegalArgumentException("Image sizes must be valid");
        }
        int width = Integer.parseInt(sizes[0]);
        int height = Integer.parseInt(sizes[1]);
        return new int[]{width, height};
    }

    public static InputStream resizeImageToInputStream(Resource image, String size, String extension) throws IOException {
        InputStream in = image.getInputStream();
        BufferedImage bufferedImage = ImageIO.read(in);
        in.close();

        int[] sizes = splitStringSizesParameter(size);
        BufferedImage bufferedImg = Thumbnails.of(bufferedImage)
                .size(sizes[0], sizes[1])
                .outputFormat(extension)
                .asBufferedImage();

        ByteArrayOutputStream outStream = new ByteArrayOutputStream();
        ImageIO.write(bufferedImg, extension, outStream);

        return new ByteArrayInputStream(outStream.toByteArray());
    }

    public static MultipartFile resizeImageToMultipartFile(MultipartFile file, String size) throws IOException {
        try (InputStream inputStream = ImageProcessingUtils
                .resizeImageToInputStream(file.getResource(), size, FilenameUtils.getExtension(file.getOriginalFilename()))) {
            return new ResizedMultipartFile(inputStream.readAllBytes(),
                    file.getName(),
                    file.getOriginalFilename(),
                    file.getContentType()
            );
        }
    }
}
