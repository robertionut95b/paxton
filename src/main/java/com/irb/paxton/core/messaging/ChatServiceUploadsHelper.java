package com.irb.paxton.core.messaging;

import com.irb.paxton.core.media.ImageBreakpointSizes;
import com.irb.paxton.core.media.ImageProcessingUtils;
import com.irb.paxton.core.media.ResizedImageMultipartFile;
import com.irb.paxton.core.model.storage.File;
import com.irb.paxton.storage.FileImageResponse;
import com.irb.paxton.storage.FileResponse;
import com.irb.paxton.storage.FileStorageObjectArgs;
import com.irb.paxton.storage.StorageService;
import com.irb.paxton.storage.exception.FileAlreadyExistsExceptionException;
import com.irb.paxton.storage.exception.FileStorageEmptyFileException;
import com.irb.paxton.storage.exception.FileStorageException;
import com.irb.paxton.storage.naming.FileNamingStandard;
import lombok.RequiredArgsConstructor;
import org.apache.commons.compress.utils.FileNameUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ChatServiceUploadsHelper {

    public static final String COULD_NOT_STORE_FILE_MSG = "Could not store file";
    public static final String BASE_FILENAME_FORMAT_STR = "%s.%s";

    private final FileNamingStandard fileNamingStandard;

    private final StorageService storageService;

    private final MessageFileService messageFileService;

    public Set<File> processImageMultipartFilesForChatId(Long chatId, List<MultipartFile> multipartFileList) {
        LocalDateTime timeNow = LocalDateTime.now();
        // check if image content does not already exist (as filename + extension)
        multipartFileList.forEach(f -> {
            try {
                this.checkFileByContentAlreadyExists(chatId, BASE_FILENAME_FORMAT_STR.formatted(fileNamingStandard.getFileName(f.getBytes()), FileNameUtils.getExtension(f.getOriginalFilename())));
            } catch (IOException e) {
                throw new FileStorageEmptyFileException(COULD_NOT_STORE_FILE_MSG, e);
            }
        });
        Stream<MultipartFile> originalResizedToLargeStream = multipartFileList
                .stream()
                .map(mpf -> processResize(mpf, ImageBreakpointSizes.LARGE));
        // resize the original image files to thumbnail image used in list view
        Stream<MultipartFile> originalResizedToThumbnailSmallStream = multipartFileList
                .stream()
                .map(mpf -> processResize(mpf, ImageBreakpointSizes.EXTRA_XS_SMALL));
        // upload file by Storage service
        return Stream.concat(originalResizedToLargeStream, originalResizedToThumbnailSmallStream)
                .map(ResizedImageMultipartFile.class::cast)
                .map(mpf -> {
                    try {
                        File fr = storageService.store(FileStorageObjectArgs
                                .builder()
                                .fileName(formatFileNameToImageSize(mpf))
                                .filePath(this.formatFilePath(chatId, timeNow, mpf.getOriginalFileBytes()))
                                .multipartFile(mpf)
                                .build());
                        return new FileImageResponse(fr.getName(), fr.getPath(), fr.getFileType(), fr.getProvider(), mpf.getWidth(), mpf.getHeight(), mpf.getQuality());
                    } catch (IOException e) {
                        throw new FileStorageException(COULD_NOT_STORE_FILE_MSG, e);
                    }
                })
                .collect(Collectors.toSet());
    }

    public void checkFileByContentAlreadyExists(Long chatId, String fileName) {
        Optional<MessageFile> file = this.messageFileService
                .findByMessage_Chat_IdAndName(chatId, fileName);
        if (file.isPresent()) {
            throw new FileAlreadyExistsExceptionException("Files already exist in this conversation");
        }
    }

    private MultipartFile processResize(MultipartFile multipartFile, ImageBreakpointSizes breakPointValue) {
        String couldNotResizeImageMsg = "Could not resize image";
        try {
            return ImageProcessingUtils.resizeImageToMultipartFile(multipartFile, breakPointValue.toIntValue(), breakPointValue.toIntValue());
        } catch (IOException e) {
            throw new FileStorageException(couldNotResizeImageMsg, e);
        }
    }

    private String formatFileNameToImageSize(ResizedImageMultipartFile resizedImgFile) throws IOException {
        if (resizedImgFile.getWidth() < ImageBreakpointSizes.LARGE.toIntValue() - 1 && resizedImgFile.getHeight() < ImageBreakpointSizes.LARGE.toIntValue() - 1)
            return "%s-%spx.%s".formatted(
                    fileNamingStandard.getFileName(resizedImgFile.getOriginalFileBytes()),
                    resizedImgFile.getWidth(),
                    FileNameUtils.getExtension(resizedImgFile.getOriginalFilename()).toLowerCase()
            );
        return BASE_FILENAME_FORMAT_STR.formatted(
                fileNamingStandard.getFileName(resizedImgFile.getOriginalFileBytes()),
                FileNameUtils.getExtension(resizedImgFile.getOriginalFilename()).toLowerCase()
        );
    }

    public Set<File> processMultipartFilesForChatId(Long chatId, List<MultipartFile> multipartFileList) {
        LocalDateTime timeNow = LocalDateTime.now();
        // check if file content does not already exist (as filename + extension)
        multipartFileList.forEach(f -> {
            try {
                this.checkFileByContentAlreadyExists(chatId, BASE_FILENAME_FORMAT_STR.formatted(fileNamingStandard.getFileName(f.getBytes()), FileNameUtils.getExtension(f.getOriginalFilename())));
            } catch (IOException e) {
                throw new FileStorageEmptyFileException(COULD_NOT_STORE_FILE_MSG, e);
            }
        });
        // upload file by Storage service
        return multipartFileList
                .stream()
                .map(mpf -> {
                    try {
                        File fr = storageService.store(FileStorageObjectArgs
                                .builder()
                                .fileName(formatFileName(mpf))
                                .filePath(this.formatFilePath(chatId, timeNow, mpf.getBytes()))
                                .multipartFile(mpf)
                                .build());
                        return new FileResponse(fr.getName(), fr.getPath(), fr.getFileType());
                    } catch (IOException e) {
                        throw new FileStorageException(COULD_NOT_STORE_FILE_MSG, e);
                    }
                })
                .collect(Collectors.toSet());
    }

    private String[] formatFilePath(Long chatId, LocalDateTime date, byte[] fileContents) throws IOException {
        String stringDateNow = date.format(DateTimeFormatter.ISO_DATE);
        String stringTimestampNow = date.format(DateTimeFormatter.ofPattern("yyyy-MM-dd-hhmmssSS"));
        return new String[]{"chats", chatId.toString(), stringDateNow, fileNamingStandard.getFileName(fileContents), stringTimestampNow};
    }

    private String formatFileName(MultipartFile multipartFile) throws IOException {
        return BASE_FILENAME_FORMAT_STR.formatted(
                fileNamingStandard.getFileName(multipartFile.getBytes()),
                FileNameUtils.getExtension(multipartFile.getOriginalFilename())
        );
    }
}
