package com.irb.paxton.core.organization.exception;

import com.irb.paxton.exceptions.handler.common.AbstractAlreadyExistsException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.Map;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class RecruiterAlreadyAssignedException extends AbstractAlreadyExistsException {

    public RecruiterAlreadyAssignedException() {
    }

    public RecruiterAlreadyAssignedException(String message) {
        super(message);
    }

    public RecruiterAlreadyAssignedException(String message, Throwable cause) {
        super(message, cause);
    }

    public RecruiterAlreadyAssignedException(Throwable cause) {
        super(cause);
    }

    public RecruiterAlreadyAssignedException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }

    public RecruiterAlreadyAssignedException(Map<String, Object> errors) {
        super(errors);
    }

    public RecruiterAlreadyAssignedException(String message, Map<String, Object> errors) {
        super(message, errors);
    }

    public RecruiterAlreadyAssignedException(String message, Throwable cause, Map<String, Object> errors) {
        super(message, cause, errors);
    }

    public RecruiterAlreadyAssignedException(Throwable cause, Map<String, Object> errors) {
        super(cause, errors);
    }

    public RecruiterAlreadyAssignedException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace, Map<String, Object> errors) {
        super(message, cause, enableSuppression, writableStackTrace, errors);
    }
}
