package com.irb.paxton.exceptions.handler.common;

import java.util.Map;

public abstract class AbstractAlreadyExistsException extends PaxtonValidationException {

    protected AbstractAlreadyExistsException() {
    }

    protected AbstractAlreadyExistsException(String message) {
        super(message);
    }

    protected AbstractAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }

    protected AbstractAlreadyExistsException(Throwable cause) {
        super(cause);
    }

    protected AbstractAlreadyExistsException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }

    protected AbstractAlreadyExistsException(Map<String, Object> errors) {
        super(errors);
    }

    protected AbstractAlreadyExistsException(String message, Map<String, Object> errors) {
        super(message, errors);
    }

    protected AbstractAlreadyExistsException(String message, Throwable cause, Map<String, Object> errors) {
        super(message, cause, errors);
    }

    protected AbstractAlreadyExistsException(Throwable cause, Map<String, Object> errors) {
        super(cause, errors);
    }

    protected AbstractAlreadyExistsException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace, Map<String, Object> errors) {
        super(message, cause, enableSuppression, writableStackTrace, errors);
    }
}
