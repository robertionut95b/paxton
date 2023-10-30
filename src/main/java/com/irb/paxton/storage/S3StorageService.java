package com.irb.paxton.storage;

import com.irb.paxton.storage.exception.PaxtonMinioException;
import io.minio.*;
import io.minio.errors.MinioException;
import io.minio.messages.Item;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Slf4j
@Service
@ConditionalOnBean(value = MinioClient.class)
public class S3StorageService implements StorageService, BucketStorageService<Result<Item>> {

    @Autowired
    private final MinioClient minioClient;

    private final String bucketName = "paxton-storage";

    private final Path tmpDir = Paths.get(System.getProperty("java.io.tmpdir"));

    public S3StorageService(MinioClient minioClient) {
        this.minioClient = minioClient;
        this.init();
    }

    @Override
    @SneakyThrows
    public void init() {
        try {
            boolean initialBucket = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
            if (!initialBucket) {
                // create new bucket
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
            } else log.info("Found S3 bucket {}", bucketName);
        } catch (MinioException e) {
            log.error("Could not initialize bucket [{}]", bucketName, e);
            throw new PaxtonMinioException("Could not initialize bucket [%s]".formatted(bucketName));
        }
    }

    @SneakyThrows
    @Override
    public FileResponse store(MultipartFile file, String... additionalPath) {

        if (file == null || file.getOriginalFilename() == null) {
            throw new IllegalArgumentException("File must not be empty");
        }

        Path destinationFile = this.tmpDir
                .resolve(Paths.get(file.getOriginalFilename()))
                .normalize();
        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
        }

        // upload the object to bucket
        String fileExtension = FilenameUtils.getExtension(file.getOriginalFilename());
        String fileName = UUID.randomUUID().toString();
        String destinationObject = String.join("/", additionalPath) + "/%s.%s".formatted(fileName, fileExtension);
        try {
            minioClient.uploadObject(
                    UploadObjectArgs.builder()
                            .bucket(bucketName)
                            .filename(destinationFile.toString())
                            .object(destinationObject)
                            .build()
            );
        } catch (MinioException e) {
            log.error("Could not upload file to Minio instance", e);
            throw new PaxtonMinioException("Could not upload file [%s] to Minio instance".formatted(file.getOriginalFilename()));
        } finally {
            Files.deleteIfExists(destinationFile);
        }
        return new FileResponse("%s.%s".formatted(fileName, fileExtension), destinationObject);
    }

    @SneakyThrows
    @Override
    public Resource loadAsResourceFromPath(String filePath) {
        try {
            InputStream inputStreamObject = minioClient.getObject(GetObjectArgs.builder()
                    .bucket(bucketName)
                    .object(filePath)
                    .build());
            return new InputStreamResource(inputStreamObject);
        } catch (MinioException e) {
            log.error("Could not retrieve file from Minio instance", e);
            throw new PaxtonMinioException("Could not retrieve file [%s] from Minio instance".formatted(filePath));
        }
    }

    @SneakyThrows
    @Override
    public void remove(String filePath) {
        try {
            minioClient.removeObject(RemoveObjectArgs.builder()
                    .bucket(bucketName)
                    .object(filePath)
                    .build());
        } catch (MinioException e) {
            log.error("Could not remove file from Minio instance", e);
            throw new PaxtonMinioException("Could not remove file [%s] from Minio instance".formatted(filePath));
        }
    }

    @Override
    public void deleteAll() {
        throw new UnsupportedOperationException();
    }

    @Override
    public Iterable<Result<Item>> listObjectsInBucket() {
        return minioClient.listObjects(
                ListObjectsArgs.builder()
                        .bucket(bucketName)
                        .build()
        );
    }
}
