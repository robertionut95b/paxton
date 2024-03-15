package com.irb.paxton.storage.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class PaxtonMinioException extends FileStorageException {

    public PaxtonMinioException() {
    }

    public PaxtonMinioException(String message) {
        super(message);
    }

    public PaxtonMinioException(String message, Throwable cause) {
        super(message, cause);
    }
}
