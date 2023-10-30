package com.irb.paxton.storage.exception;

import io.minio.errors.MinioException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class PaxtonMinioException extends MinioException {

    public PaxtonMinioException() {
    }

    public PaxtonMinioException(String message) {
        super(message);
    }

    public PaxtonMinioException(String message, String httpTrace) {
        super(message, httpTrace);
    }
}
