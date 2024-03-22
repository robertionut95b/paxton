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

    private static final float GLOBAL_QUALITY_FACTOR = 0.65f;

    private ImageProcessingUtils() {
    }

    private static int[] splitStringSizesParameter(String size) {
        String[] sizes = size.split("x");
        if (sizes.length != 2) {
            throw new IllegalArgumentException("Image sizes must be valid");
        }
        int width = Integer.parseInt(sizes[0]);
        int height = Integer.parseInt(sizes[1]);
        return new int[]{width, height};
    }

    public static ImageInputStreamWithMeta resizeImageToInputStream(Resource image, String size, String extension) throws IOException {
        InputStream in = image.getInputStream();
        BufferedImage bufferedImage = ImageIO.read(in);
        in.close();

        int[] sizes = splitStringSizesParameter(size);
        BufferedImage bufferedImg = Thumbnails.of(bufferedImage)
                .size(sizes[0], sizes[1])
                .outputFormat(extension)
                .outputQuality(GLOBAL_QUALITY_FACTOR)
                .asBufferedImage();

        ByteArrayOutputStream outStream = new ByteArrayOutputStream();
        ImageIO.write(bufferedImg, extension, outStream);

        return new ImageInputStreamWithMeta(new ByteArrayInputStream(outStream.toByteArray()), bufferedImg.getWidth(), bufferedImg.getHeight(), 0.7f);
    }

    public static ImageInputStreamWithMeta resizeImageToInputStream(Resource image, int width, int height, String extension) throws IOException {
        InputStream in = image.getInputStream();
        BufferedImage bufferedImage = ImageIO.read(in);
        in.close();

        BufferedImage bufferedImg = Thumbnails.of(bufferedImage)
                .size(width, height)
                .outputFormat(extension)
                .outputQuality(GLOBAL_QUALITY_FACTOR)
                .asBufferedImage();

        ByteArrayOutputStream outStream = new ByteArrayOutputStream();
        ImageIO.write(bufferedImg, extension, outStream);

        return new ImageInputStreamWithMeta(new ByteArrayInputStream(outStream.toByteArray()), bufferedImg.getWidth(), bufferedImg.getHeight(), 0.7f);
    }

    public static MultipartFile resizeImageToMultipartFile(MultipartFile file, String size) throws IOException {
        ImageInputStreamWithMeta imageMeta = ImageProcessingUtils
                .resizeImageToInputStream(file.getResource(), size, FilenameUtils.getExtension(file.getOriginalFilename()));
        try (InputStream inputStream = imageMeta.imageStream) {
            return new ResizedImageMultipartFile(inputStream.readAllBytes(),
                    file.getBytes(),
                    file.getName(),
                    file.getOriginalFilename(),
                    file.getContentType(),
                    imageMeta.width(),
                    imageMeta.height(),
                    imageMeta.quality()
            );
        }
    }

    public static MultipartFile resizeImageToMultipartFile(MultipartFile file, int width, int height) throws IOException {
        ImageInputStreamWithMeta imageMeta = ImageProcessingUtils
                .resizeImageToInputStream(file.getResource(), width, height, FilenameUtils.getExtension(file.getOriginalFilename()));
        try (InputStream inputStream = imageMeta.imageStream()) {
            return new ResizedImageMultipartFile(inputStream.readAllBytes(),
                    file.getBytes(),
                    file.getName(),
                    file.getOriginalFilename(),
                    file.getContentType(),
                    imageMeta.width(),
                    imageMeta.height(),
                    imageMeta.quality()
            );
        }
    }

    public record ImageInputStreamWithMeta(InputStream imageStream, int width, int height, float quality) {
    }
}
