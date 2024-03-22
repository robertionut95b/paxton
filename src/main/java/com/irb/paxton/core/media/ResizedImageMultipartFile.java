package com.irb.paxton.core.media;

import com.irb.paxton.core.model.storage.ImageFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;

public class ResizedImageMultipartFile implements MultipartFile, ImageFile {

    private final byte[] input;

    private final byte[] originalInput;

    private final String name;

    private final String originalFileName;

    private final String contentType;

    private final int width;

    private final int height;

    private final float quality;

    public ResizedImageMultipartFile(byte[] input, byte[] originalInput, String name, String originalFileName, String contentType, int width, int height, float quality) {
        this.input = input;
        this.originalInput = originalInput;
        this.name = name;
        this.originalFileName = originalFileName;
        this.contentType = contentType;
        this.width = width;
        this.height = height;
        this.quality = quality;
    }

    @Override
    public String getName() {
        return this.name;
    }

    @Override
    public String getOriginalFilename() {
        return this.originalFileName;
    }

    @Override
    public String getContentType() {
        return this.contentType;
    }

    @Override
    public boolean isEmpty() {
        return input == null || input.length == 0;
    }

    @Override
    public long getSize() {
        return input.length;
    }

    @Override
    public byte[] getBytes() throws IOException {
        return input;
    }

    public byte[] getOriginalFileBytes() {
        return originalInput;
    }

    @Override
    public InputStream getInputStream() throws IOException {
        return new ByteArrayInputStream(input);
    }

    @Override
    public void transferTo(File dest) throws IOException, IllegalStateException {
        try (FileOutputStream fos = new FileOutputStream(dest)) {
            fos.write(input);
        }
    }

    @Override
    public int getWidth() {
        return this.width;
    }

    @Override
    public int getHeight() {
        return this.height;
    }

    @Override
    public float getQuality() {
        return this.quality;
    }
}
