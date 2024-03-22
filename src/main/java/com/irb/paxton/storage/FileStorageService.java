package com.irb.paxton.storage;

import com.irb.paxton.config.properties.FileStorageProperties;
import com.irb.paxton.core.model.storage.File;
import com.irb.paxton.core.model.storage.FileType;
import com.irb.paxton.storage.exception.FileAlreadyExistsExceptionException;
import com.irb.paxton.storage.exception.FileStorageEmptyFileException;
import com.irb.paxton.storage.exception.FileStorageException;
import com.irb.paxton.storage.naming.FileNamingStandard;
import io.minio.MinioClient;
import org.apache.commons.io.FileUtils;
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
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
@ConditionalOnMissingBean(value = MinioClient.class)
public class FileStorageService implements StorageService {

    private final Path rootLocation;

    private final FileNamingStandard fileNamingStandard;

    public FileStorageService(FileStorageProperties properties, FileNamingStandard fileNamingStandard) {
        this.rootLocation = Paths.get(
                "%s/%s/".formatted(properties.getStorageRootPath(), properties.getStorageUserPath())
        );
        this.fileNamingStandard = fileNamingStandard;
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
        String newFileName;
        try {
            newFileName = "%s.%s".formatted(fileNamingStandard.getFileName(file.getBytes()), fileExtension);
        } catch (IOException e) {
            throw new FileStorageException("Failed to store file.", e);
        }
        Path additionalPaths = Paths.get("", additionalPath);
        String newFilePath = additionalPaths
                .resolve(newFileName).toString();
        try {
            if (file.isEmpty()) {
                throw new FileStorageEmptyFileException("Failed to store empty file");
            }
            if (file.getOriginalFilename() == null) {
                throw new FileStorageEmptyFileException("Failed to store file with invalid name");
            }
            destinationFile = this.rootLocation
                    .resolve(additionalPaths)
                    .resolve(newFileName)
                    .normalize();
            try (InputStream inputStream = file.getInputStream()) {
                if (!destinationFile.getParent().startsWith(this.rootLocation)) {
                    throw new FileStorageException("Cannot store file outside current directory.");
                }
                FileUtils.copyInputStreamToFile(inputStream, destinationFile.toFile());
            }
        } catch (FileAlreadyExistsException e) {
            throw new FileAlreadyExistsExceptionException("This file already exists.", e);
        } catch (IOException e) {
            throw new FileStorageException("Failed to store file.", e);
        }
        return new FileResponse(newFileName, newFilePath, FileType.parseString(FilenameUtils.getExtension(newFileName)));
    }

    @Override
    public File store(FileStorageObjectArgs args) {
        MultipartFile file = args.getMultipartFile();
        String additionalPath = args.getFilePath() == null ? "" : String.join("/", args.getFilePath());

        Path destinationFile;
        String fileExtension = FilenameUtils.getExtension(file.getOriginalFilename());
        String newFileName;
        if (args.getFileName() == null) {
            try {
                newFileName = "%s.%s".formatted(fileNamingStandard.getFileName(file.getBytes()), fileExtension);
            } catch (IOException e) {
                throw new FileStorageException("Failed to store file.", e);
            }
        } else newFileName = args.getFileName();
        Path additionalPaths = Paths.get("", additionalPath);
        String newFilePath = additionalPaths
                .resolve(newFileName)
                .toString();
        try {
            if (file.isEmpty()) {
                throw new FileStorageEmptyFileException("Failed to store empty file");
            }
            if (file.getOriginalFilename() == null) {
                throw new FileStorageEmptyFileException("Failed to store file with invalid name");
            }
            destinationFile = this.rootLocation
                    .resolve(additionalPaths)
                    .resolve(newFileName)
                    .normalize();
            try (InputStream inputStream = file.getInputStream()) {
                if (!destinationFile.getParent().startsWith(this.rootLocation)) {
                    throw new FileStorageException("Cannot store file outside current directory.");
                }
                FileUtils.copyInputStreamToFile(inputStream, destinationFile.toFile());
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
