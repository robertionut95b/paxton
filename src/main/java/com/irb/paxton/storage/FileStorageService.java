package com.irb.paxton.storage;

import com.irb.paxton.storage.exception.FileNotFoundException;
import com.irb.paxton.storage.exception.FileStorageException;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;

import static com.irb.paxton.storage.FileStorageProperties.FILES_URL_MAPPING;
import static com.irb.paxton.storage.FileStorageProperties.USER_STORAGE_UPLOAD_PATH;

@Service
@Slf4j
public class FileStorageService {

    private final Path filesUserUploadsStorageLoc;

    @Autowired
    public FileStorageService() {
        this.filesUserUploadsStorageLoc = Paths.get(USER_STORAGE_UPLOAD_PATH)
                .toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.filesUserUploadsStorageLoc);
        } catch (Exception ex) {
            throw new FileStorageException("Cannot create the storage directory", ex);
        }
    }

    public FileResponse storeFile(@NotNull MultipartFile file, String path) {
        String fileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        try {
            // Check if the file's name contains invalid characters
            if (fileName.contains("..")) {
                throw new FileStorageException("File name contains invalid path sequence " + fileName);
            }
            if (path != null) {
                Files.createDirectories(this.filesUserUploadsStorageLoc.resolve(path));
            }
            // Copy file to the target location (Replacing existing file with the same name)
            Path targetLocation = path != null ?
                    this.filesUserUploadsStorageLoc.resolve(path).resolve(fileName)
                    : this.filesUserUploadsStorageLoc.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            String urlLocation = String.format("%s/%s/%s", FILES_URL_MAPPING, path, fileName);

            return new FileResponse(fileName, urlLocation);
        } catch (IOException ex) {
            throw new FileStorageException(String.format("Could not store file %s", fileName), ex);
        }
    }

    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = this.filesUserUploadsStorageLoc.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new FileNotFoundException("File not found " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new FileNotFoundException("File not found " + fileName, ex);
        }
    }

    public boolean removeFile(@NotNull String currentBannerPath) {
        Path targetPath = Path.of(USER_STORAGE_UPLOAD_PATH, currentBannerPath.split(FILES_URL_MAPPING + "/")[1]);
        try {
            System.out.println(targetPath);
            return Files.deleteIfExists(targetPath);
        } catch (IOException e) {
            log.warn(String.format("Could not delete : File not found %s", targetPath), e);
        }
        return false;
    }
}
