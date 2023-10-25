package com.irb.paxton.exceptions.handler.common;

public abstract class PaxtonRuntimeException extends RuntimeException {

    protected PaxtonRuntimeException() {
        super();
    }

    protected PaxtonRuntimeException(String message) {
        super(message);
    }

    protected PaxtonRuntimeException(String message, Throwable cause) {
        super(message, cause);
    }

    protected PaxtonRuntimeException(Throwable cause) {
        super(cause);
    }

    protected PaxtonRuntimeException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
