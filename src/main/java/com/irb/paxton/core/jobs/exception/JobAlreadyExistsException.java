package com.irb.paxton.core.jobs.exception;

import com.irb.paxton.exceptions.handler.common.AbstractAlreadyExistsException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.io.Serial;
import java.util.Map;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class JobAlreadyExistsException extends AbstractAlreadyExistsException {

    @Serial
    private static final long serialVersionUID = 1803708763847314597L;

    public JobAlreadyExistsException() {
    }

    public JobAlreadyExistsException(String message) {
        super(message);
    }

    public JobAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }

    public JobAlreadyExistsException(Throwable cause) {
        super(cause);
    }

    public JobAlreadyExistsException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }

    public JobAlreadyExistsException(Map<String, Object> errors) {
        super(errors);
    }

    public JobAlreadyExistsException(String message, Map<String, Object> errors) {
        super(message, errors);
    }

    public JobAlreadyExistsException(String message, Throwable cause, Map<String, Object> errors) {
        super(message, cause, errors);
    }

    public JobAlreadyExistsException(Throwable cause, Map<String, Object> errors) {
        super(cause, errors);
    }

    public JobAlreadyExistsException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace, Map<String, Object> errors) {
        super(message, cause, enableSuppression, writableStackTrace, errors);
    }
}
