package com.irb.paxton.core.candidate.exception;

import java.io.Serial;

public class ApplicationNotFoundException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 3710672327013105433L;

    private String path;

    public ApplicationNotFoundException(String message, String path) {
        super(message);
        this.path = path;
    }

    public ApplicationNotFoundException(String message, Throwable cause, String path) {
        super(message, cause);
        this.path = path;
    }
}
