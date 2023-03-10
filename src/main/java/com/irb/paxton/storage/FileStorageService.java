package com.irb.paxton.storage;

import com.irb.paxton.config.properties.FileStorageProperties;
import com.irb.paxton.storage.exception.FileAlreadyExistsExceptionException;
import com.irb.paxton.storage.exception.FileStorageException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.Objects;

@Service
public class FileStorageService implements StorageService {

    private final Path rootLocation;

    @Autowired
    public FileStorageService(FileStorageProperties properties) {
        this.rootLocation = Paths.get(
                "%s/%s/".formatted(properties.getStorageRootPath(), properties.getStorageUserPath())
        );
    }

    @Override
    public void init() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new FileStorageException("Could not initialize storage", e);
        }
    }

    @Override
    public void store(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new FileStorageException("Failed to store empty file.");
            }
            Path destinationFile = this.rootLocation.resolve(
                            Paths.get(Objects.requireNonNull(file.getOriginalFilename()))
                    )
                    .normalize();
            if (!destinationFile.getParent().startsWith(this.rootLocation)) {
                throw new FileStorageException("Cannot store file outside current directory.");
            }
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException e) {
            throw new FileStorageException("Failed to store file.", e);
        }
    }

    public FileResponse storeWithPaths(MultipartFile file, String... additionalPath) {
        Path destinationFile;
        try {
            if (file.isEmpty()) {
                throw new FileStorageException("Failed to store empty file.");
            }
            if (file.getOriginalFilename() == null) {
                throw new FileStorageException("File has no name.");
            }
            Path additionalPaths = Paths.get("", additionalPath);
            destinationFile = this.rootLocation
                    .resolve(additionalPaths)
                    .resolve(Paths.get(file.getOriginalFilename()))
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
        return new FileResponse(file.getOriginalFilename(), destinationFile.toString());
    }

    @Override
    public Path load(String filename) {
        return rootLocation.resolve(filename);
    }

    @Override
    public Resource loadAsResource(String filename) {
        try {
            Path file = load(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new FileStorageException("Could not read file: %s".formatted(filename));
            }
        } catch (MalformedURLException e) {
            throw new FileStorageException("Could not read file: %s".formatted(filename), e);
        }
    }

    @Override
    public Resource loadAsResourceFromFullPath(String filePath) {
        try {
            Path file = Paths.get(filePath);
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
    public void remove(String filename) {
        Path targetPath = Paths.get(filename);
        if (!targetPath.getParent().startsWith(this.rootLocation)) {
            throw new FileStorageException("Cannot delete file outside current directory.");
        }
        try {
            Files.deleteIfExists(targetPath);
        } catch (IOException e) {
            throw new FileStorageException("Could not delete : File not found %s".formatted(targetPath));
        }
    }

    @Override
    public void remove(Path filePath) {
        Path targetPath = this.load(filePath.toString());
        if (!filePath.getParent().startsWith(this.rootLocation)) {
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
