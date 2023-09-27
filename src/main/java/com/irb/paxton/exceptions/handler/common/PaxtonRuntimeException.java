package com.irb.paxton.exceptions.handler.common;

public class PaxtonRuntimeException extends RuntimeException {

    public PaxtonRuntimeException() {
        super();
    }

    public PaxtonRuntimeException(String message) {
        super(message);
    }

    public PaxtonRuntimeException(String message, Throwable cause) {
        super(message, cause);
    }

    public PaxtonRuntimeException(Throwable cause) {
        super(cause);
    }

    protected PaxtonRuntimeException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
