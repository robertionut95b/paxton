package com.irb.paxton.core.media;

import org.springframework.web.multipart.MultipartFile;

import java.io.*;

public class ResizedMultipartFile implements MultipartFile {

    private final byte[] input;

    private final String name;

    private final String originalFileName;

    private final String contentType;

    public ResizedMultipartFile(byte[] input, String name, String originalFileName, String contentType) {
        this.input = input;
        this.name = name;
        this.originalFileName = originalFileName;
        this.contentType = contentType;
    }

    @Override
    public String getName() {
        return this.getName();
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
}
