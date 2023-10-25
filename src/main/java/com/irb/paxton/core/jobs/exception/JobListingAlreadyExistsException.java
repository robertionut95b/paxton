package com.irb.paxton.core.jobs.exception;

import com.irb.paxton.exceptions.handler.common.AbstractAlreadyExistsException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.io.Serial;
import java.util.Map;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class JobListingAlreadyExistsException extends AbstractAlreadyExistsException {

    @Serial
    private static final long serialVersionUID = 1172557373728115880L;

    public JobListingAlreadyExistsException() {
    }

    public JobListingAlreadyExistsException(String message) {
        super(message);
    }

    public JobListingAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }

    public JobListingAlreadyExistsException(Throwable cause) {
        super(cause);
    }

    public JobListingAlreadyExistsException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }

    public JobListingAlreadyExistsException(Map<String, Object> errors) {
        super(errors);
    }

    public JobListingAlreadyExistsException(String message, Map<String, Object> errors) {
        super(message, errors);
    }

    public JobListingAlreadyExistsException(String message, Throwable cause, Map<String, Object> errors) {
        super(message, cause, errors);
    }

    public JobListingAlreadyExistsException(Throwable cause, Map<String, Object> errors) {
        super(cause, errors);
    }

    public JobListingAlreadyExistsException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace, Map<String, Object> errors) {
        super(message, cause, enableSuppression, writableStackTrace, errors);
    }
}
