package com.irb.paxton.storage;

import com.irb.paxton.config.properties.FileStorageProperties;
import com.irb.paxton.core.model.storage.FileType;
import com.irb.paxton.storage.exception.FileAlreadyExistsExceptionException;
import com.irb.paxton.storage.exception.FileStorageException;
import io.minio.MinioClient;
import org.apache.commons.io.FilenameUtils;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.UUID;

@Service
@ConditionalOnMissingBean(value = MinioClient.class)
public class FileStorageService implements StorageService {

    private final Path rootLocation;

    public FileStorageService(FileStorageProperties properties) {
        this.rootLocation = Paths.get(
                "%s/%s/".formatted(properties.getStorageRootPath(), properties.getStorageUserPath())
        );
        this.init();
    }

    @Override
    public void init() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new FileStorageException("Could not initialize storage", e);
        }
    }

    public FileResponse store(MultipartFile file, String... additionalPath) {
        Path destinationFile;
        String fileExtension = FilenameUtils.getExtension(file.getOriginalFilename());
        String fileName = UUID.randomUUID().toString();
        String newFileName = "%s.%s".formatted(fileName, fileExtension);
        Path additionalPaths = Paths.get("", additionalPath);
        String newFilePath = additionalPaths
                .resolve(newFileName).toString();
        try {
            if (file.isEmpty()) {
                throw new FileStorageException("Failed to store empty file.");
            }
            if (file.getOriginalFilename() == null) {
                throw new FileStorageException("File has no name.");
            }

            destinationFile = this.rootLocation
                    .resolve(additionalPaths)
                    .resolve(newFileName)
                    .normalize();
            // create subdirectories if not exists
            Files.createDirectories(destinationFile);
            if (!destinationFile.getParent().startsWith(this.rootLocation)) {
                throw new FileStorageException("Cannot store file outside current directory.");
            }
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (FileAlreadyExistsException e) {
            throw new FileAlreadyExistsExceptionException("This file already exists.", e);
        } catch (IOException e) {
            throw new FileStorageException("Failed to store file.", e);
        }
        return new FileResponse(newFileName, newFilePath, FileType.parseString(FilenameUtils.getExtension(newFileName)));
    }

    @Override
    public Resource loadAsResourceFromPath(String filePath) {
        try {
            Path file = this.rootLocation.resolve(Paths.get(filePath));
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new FileStorageException("Could not read file: " + filePath);
            }
        } catch (MalformedURLException e) {
            throw new FileStorageException("Could not read file: " + filePath, e);
        }
    }

    @Override
    public void remove(String filePath) {
        Path targetPath = this.rootLocation.resolve(filePath);
        if (!targetPath.getParent().startsWith(this.rootLocation)) {
            throw new FileStorageException("Cannot delete file outside current directory.");
        }
        try {
            Files.deleteIfExists(targetPath);
        } catch (IOException e) {
            throw new FileStorageException("Could not delete : File not found %s".formatted(filePath));
        }
    }

    @Override
    public void deleteAll() {
        FileSystemUtils.deleteRecursively(rootLocation.toFile());
    }

}
