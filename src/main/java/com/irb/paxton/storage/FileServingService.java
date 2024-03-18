package com.irb.paxton.storage;

import com.irb.paxton.core.media.ImageProcessor;
import com.irb.paxton.core.model.storage.File;
import com.irb.paxton.core.model.storage.FileType;
import com.irb.paxton.storage.exception.FileNotFoundException;
import com.irb.paxton.storage.exception.FileStorageException;
import com.irb.paxton.utils.PaxtonMimeTypesUtils;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.io.InputStream;

@Service
@RequiredArgsConstructor
public class FileServingService {

    private final StorageService storageService;

    private final RestTemplate restTemplate;

    public byte[] serveFileByFileName(final File file) {
        if (!file.getProvider().equals(FileProvider.LOCAL))
            return this.getFromExternalUrl(file);
        // load file as resource then output to byte array
        try (InputStream in = storageService.loadAsResourceFromPath(file.getPath()).getInputStream()) {
            return IOUtils.toByteArray(in);
        } catch (IOException e) {
            throw new FileStorageException("Could not load file", e);
        }
    }

    public byte[] serveResizableImageByFileNameAndSize(final File file, final String size) {
        if (!file.getFileType().equals(FileType.IMAGE_JPEG) || !file.getFileType().equals(FileType.IMAGE_PNG))
            throw new IllegalArgumentException("File is not resizeable");
        if (!file.getProvider().equals(FileProvider.LOCAL))
            return this.getFromExternalUrl(file);
        if (size == null)
            throw new IllegalArgumentException("Size parameter is not valid");
        if (size.isEmpty())
            return this.serveFileByFileName(file);
        // load image as resource then output to byte array
        try (InputStream in = ImageProcessor
                .resizeImageToInputStream(storageService.loadAsResourceFromPath(file.getPath()), size, FilenameUtils.getExtension(file.getName()))
        ) {
            return IOUtils.toByteArray(in);
        } catch (IOException e) {
            throw new FileStorageException("Could not load file", e);
        }
    }

    public byte[] getFromExternalUrl(File file) {
        try {
            return restTemplate.getForObject(file.getPath(), byte[].class);
        } catch (IllegalArgumentException | ResourceAccessException e) {
            throw new FileNotFoundException("Could not lookup external file \"%s\"".formatted(file.getName()));
        }
    }

    public ResponseEntity<byte[]> getFromUrlAsResp(String fileUrl) {
        try {
            return restTemplate.getForEntity(fileUrl, byte[].class);
        } catch (IllegalArgumentException | ResourceAccessException e) {
            throw new FileNotFoundException("Could not lookup external file \"%s\"".formatted(fileUrl));
        }
    }

    public String getExtensionFromUrlFile(ResponseEntity<byte[]> responseEntity) {
        HttpHeaders httpHeaders = responseEntity.getHeaders();
        MediaType contentTypeHeader = httpHeaders.getContentType();
        return PaxtonMimeTypesUtils.getDefaultExt(contentTypeHeader.toString());
    }
}
