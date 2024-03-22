package com.irb.paxton.storage;

import com.irb.paxton.core.model.storage.File;
import com.irb.paxton.core.model.storage.FileType;
import com.irb.paxton.storage.exception.PaxtonMinioException;
import com.irb.paxton.storage.naming.FileNamingStandard;
import io.minio.*;
import io.minio.errors.MinioException;
import io.minio.http.Method;
import io.minio.messages.Item;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@ConditionalOnBean(value = MinioClient.class)
public class S3StorageService implements StorageService, BucketStorageService<Result<Item>> {

    private static final String bucketName = "paxton-storage";
    private final MinioClient minioClient;
    private final FileNamingStandard fileNamingStandard;

    public S3StorageService(MinioClient minioClient, FileNamingStandard fileNamingStandard) {
        this.minioClient = minioClient;
        this.fileNamingStandard = fileNamingStandard;
        this.init();
    }

    @Override
    public void init() {
        try {
            boolean initialBucket = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
            if (!initialBucket) {
                // create new bucket
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
            } else log.info("Found S3 bucket {}", bucketName);
        } catch (MinioException | InvalidKeyException | IOException | NoSuchAlgorithmException e) {
            log.error("Could not initialize bucket [{}]", bucketName, e);
            throw new PaxtonMinioException("Could not initialize bucket [%s]".formatted(bucketName));
        }
    }

    @Override
    public FileResponse store(MultipartFile file, String... additionalPath) {
        if (file == null || file.getOriginalFilename() == null) {
            throw new IllegalArgumentException("File must not be empty");
        }
        // upload the object to bucket
        String fileExtension = FilenameUtils.getExtension(file.getOriginalFilename());
        String fileName;
        try {
            fileName = fileNamingStandard.getFileName(file.getBytes());
        } catch (IOException e) {
            throw new PaxtonMinioException("Could not store file", e);
        }
        String destinationObject = String.join("/", additionalPath) + "/%s.%s".formatted(fileName, fileExtension);
        try (InputStream inputStream = file.getInputStream()) {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(destinationObject)
                            .stream(inputStream, inputStream.available(), -1)
                            .build()
            );
        } catch (MinioException | NoSuchAlgorithmException | InvalidKeyException | IOException e) {
            log.error("Could not upload file to S3 instance", e);
            throw new PaxtonMinioException("Could not upload file [%s] to S3 instance".formatted(file.getOriginalFilename()));
        }
        return new FileResponse("%s.%s".formatted(fileName, fileExtension), destinationObject, FileType.parseString(fileExtension));
    }

    @Override
    public File store(FileStorageObjectArgs args) {
        MultipartFile file = args.getMultipartFile();
        // upload the object to bucket
        String fileExtension = FilenameUtils.getExtension(file.getOriginalFilename());
        String fileName;
        if (args.getFileName() == null) {
            try {
                fileName = fileNamingStandard.getFileName(file.getBytes());
            } catch (IOException e) {
                throw new PaxtonMinioException("Could not store file", e);
            }
        } else fileName = args.getFileName();
        String additionalPaths = args.getFilePath() == null ? "" : String.join("/", args.getFilePath());
        String destinationObject = additionalPaths + "/%s.%s".formatted(fileName, fileExtension);
        try (InputStream inputStream = file.getInputStream()) {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(destinationObject)
                            .stream(inputStream, inputStream.available(), -1)
                            .build()
            );
        } catch (MinioException | NoSuchAlgorithmException | InvalidKeyException | IOException e) {
            log.error("Could not upload file to S3 instance", e);
            throw new PaxtonMinioException("Could not upload file [%s] to S3 instance".formatted(file.getOriginalFilename()));
        }
        return new FileResponse("%s.%s".formatted(fileName, fileExtension), destinationObject, FileType.parseString(fileExtension));
    }

    @Override
    public Resource loadAsResourceFromPath(String filePath) {
        try {
            InputStream inputStreamObject = minioClient.getObject(GetObjectArgs.builder()
                    .bucket(bucketName)
                    .object(filePath)
                    .build());
            return new InputStreamResource(inputStreamObject);
        } catch (MinioException | InvalidKeyException | IOException | NoSuchAlgorithmException e) {
            log.error("Could not retrieve file from S3 instance", e);
            throw new PaxtonMinioException("Could not retrieve file [%s]".formatted(filePath));
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
            log.error("Could not remove file from S3 instance", e);
            throw new PaxtonMinioException("Could not remove file [%s]".formatted(filePath));
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

    @Override
    public String getPresignedUrlByObject(String objectPath) throws PaxtonMinioException {
        try {
            return minioClient
                    .getPresignedObjectUrl(GetPresignedObjectUrlArgs
                            .builder()
                            .method(Method.GET)
                            .bucket(this.bucketName)
                            .object(objectPath)
                            .expiry(1, TimeUnit.DAYS)
                            .build());
        } catch (MinioException | InvalidKeyException | IOException | NoSuchAlgorithmException e) {
            log.error("Could not load URL for object %s".formatted(objectPath), e);
            throw new PaxtonMinioException("Could not load URL for object");
        }
    }
}
