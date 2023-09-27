package com.irb.paxton.exceptions.handler.common;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public abstract class AbstractNotFoundException extends PaxtonRuntimeException {

    protected AbstractNotFoundException() {
    }

    protected AbstractNotFoundException(String message) {
        super(message);
    }

    protected AbstractNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    protected AbstractNotFoundException(Throwable cause) {
        super(cause);
    }

    protected AbstractNotFoundException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
