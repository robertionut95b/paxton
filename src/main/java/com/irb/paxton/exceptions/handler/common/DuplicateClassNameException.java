package com.irb.paxton.exceptions.handler.common;

public class DuplicateClassNameException extends RuntimeException {

    public DuplicateClassNameException() {
        super();
    }

    public DuplicateClassNameException(String message) {
        super(message);
    }

    public DuplicateClassNameException(String message, Throwable cause) {
        super(message, cause);
    }

    public DuplicateClassNameException(Throwable cause) {
        super(cause);
    }

    protected DuplicateClassNameException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
