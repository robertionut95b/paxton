package com.irb.paxton.core.candidate.exception;

import com.irb.paxton.exceptions.handler.common.AbstractNotFoundException;

import java.io.Serial;

public class ApplicationNotFoundException extends AbstractNotFoundException {

    @Serial
    private static final long serialVersionUID = 3710672327013105433L;

    public ApplicationNotFoundException() {
    }

    public ApplicationNotFoundException(String message) {
        super(message);
    }

    public ApplicationNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public ApplicationNotFoundException(Throwable cause) {
        super(cause);
    }

    public ApplicationNotFoundException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
