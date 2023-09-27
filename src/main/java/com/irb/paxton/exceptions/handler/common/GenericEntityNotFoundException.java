package com.irb.paxton.exceptions.handler.common;

public class GenericEntityNotFoundException extends AbstractNotFoundException {

    public GenericEntityNotFoundException(String message) {
        super(message);
    }

    public GenericEntityNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    protected GenericEntityNotFoundException() {
        super();
    }

    protected GenericEntityNotFoundException(Throwable cause) {
        super(cause);
    }

    protected GenericEntityNotFoundException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
