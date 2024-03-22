package com.irb.paxton.storage.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class FileStorageEmptyFileException extends FileStorageException {

    public FileStorageEmptyFileException() {
    }

    public FileStorageEmptyFileException(String message) {
        super(message);
    }

    public FileStorageEmptyFileException(String message, Throwable cause) {
        super(message, cause);
    }
}
