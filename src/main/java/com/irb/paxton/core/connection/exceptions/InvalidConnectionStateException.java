package com.irb.paxton.core.connection.exceptions;

import com.irb.paxton.exceptions.handler.common.AbstractValidationException;

public class InvalidConnectionStateException extends AbstractValidationException {

    public InvalidConnectionStateException() {
    }

    public InvalidConnectionStateException(String message) {
        super(message);
    }

    public InvalidConnectionStateException(String message, Throwable cause) {
        super(message, cause);
    }

    public InvalidConnectionStateException(Throwable cause) {
        super(cause);
    }

    public InvalidConnectionStateException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
