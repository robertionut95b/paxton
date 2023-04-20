package com.irb.paxton.exceptions.handler.common;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class EnumNotFoundException extends RuntimeException {

    public EnumNotFoundException() {
    }

    public EnumNotFoundException(String message) {
        super(message);
    }

    public EnumNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public EnumNotFoundException(Throwable cause) {
        super(cause);
    }

    public EnumNotFoundException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
