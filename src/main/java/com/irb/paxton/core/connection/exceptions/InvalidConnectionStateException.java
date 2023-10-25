package com.irb.paxton.core.connection.exceptions;

import com.irb.paxton.exceptions.handler.common.PaxtonValidationException;

import java.util.Map;

public class InvalidConnectionStateException extends PaxtonValidationException {

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

    public InvalidConnectionStateException(Map<String, Object> errors) {
        super(errors);
    }

    public InvalidConnectionStateException(String message, Map<String, Object> errors) {
        super(message, errors);
    }

    public InvalidConnectionStateException(String message, Throwable cause, Map<String, Object> errors) {
        super(message, cause, errors);
    }

    public InvalidConnectionStateException(Throwable cause, Map<String, Object> errors) {
        super(cause, errors);
    }

    public InvalidConnectionStateException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace, Map<String, Object> errors) {
        super(message, cause, enableSuppression, writableStackTrace, errors);
    }
}
