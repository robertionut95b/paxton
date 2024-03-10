package com.irb.paxton.storage;

import com.irb.paxton.core.media.ImageProcessor;
import com.irb.paxton.core.model.storage.File;
import com.irb.paxton.storage.exception.FileNotFoundException;
import com.irb.paxton.storage.exception.FileStorageException;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.io.InputStream;

@Service
@RequiredArgsConstructor
public class FileServingService {

    private final FileServingRepository fileServingRepository;

    private final StorageService storageService;

    private final RestTemplate restTemplate;

    private File findFileByName(final String fileName) {
        return fileServingRepository
                .findByName(fileName)
                .orElseThrow(() -> new FileNotFoundException("File by name \"%s\" does not exist".formatted(fileName)));
    }

    public byte[] serveFileByFileName(final String fileName) {
        // get image metadata from repository
        File file = this.findFileByName(fileName);
        // load file as resource then output to byte array
        try (InputStream in = storageService.loadAsResourceFromPath(file.getPath()).getInputStream()) {
            return IOUtils.toByteArray(in);
        } catch (IOException e) {
            throw new FileStorageException("Could not load file", e);
        }
    }

    public byte[] serveResizableImageByFileNameAndSize(final String fileName, final String size) {
        if (size == null)
            throw new IllegalArgumentException("Size parameter is not valid");
        if (size.isEmpty())
            return this.serveFileByFileName(fileName);
        // get image metadata from repository
        File file = this.findFileByName(fileName);
        // load image as resource then output to byte array
        try (InputStream in = ImageProcessor
                .resizeImageToInputStream(storageService.loadAsResourceFromPath(file.getPath()), size, FilenameUtils.getExtension(fileName))
        ) {
            return IOUtils.toByteArray(in);
        } catch (IOException e) {
            throw new FileStorageException("Could not load file", e);
        }
    }

    public byte[] getFromExternalUrlIfBase64(String fileName) {
        File file = this.findFileByName(fileName);
        try {
            return restTemplate.getForObject(file.getPath(), byte[].class);
        } catch (IllegalArgumentException | ResourceAccessException e) {
            throw new FileNotFoundException("Could not lookup external file \"%s\"".formatted(fileName));
        }
    }
}
