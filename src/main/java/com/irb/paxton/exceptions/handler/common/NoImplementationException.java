package com.irb.paxton.exceptions.handler.common;

public class NoImplementationException extends PaxtonRuntimeException {

    public NoImplementationException() {
        super();
    }

    public NoImplementationException(String message) {
        super(message);
    }

    public NoImplementationException(String message, Throwable cause) {
        super(message, cause);
    }

    public NoImplementationException(Throwable cause) {
        super(cause);
    }

    protected NoImplementationException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
