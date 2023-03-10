package com.irb.paxton.exceptions.handler.common;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public abstract class AbstractValidationException extends RuntimeException {

    protected AbstractValidationException() {
    }

    protected AbstractValidationException(String message) {
        super(message);
    }

    protected AbstractValidationException(String message, Throwable cause) {
        super(message, cause);
    }

    protected AbstractValidationException(Throwable cause) {
        super(cause);
    }

    protected AbstractValidationException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
