package com.irb.paxton.core.media;

import net.coobird.thumbnailator.Thumbnails;
import org.springframework.core.io.Resource;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

public class ImageProcessor {

    private ImageProcessor() {
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
}
