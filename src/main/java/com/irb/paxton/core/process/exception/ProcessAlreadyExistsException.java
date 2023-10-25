package com.irb.paxton.core.process.exception;

import com.irb.paxton.exceptions.handler.common.AbstractAlreadyExistsException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.io.Serial;
import java.util.Map;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ProcessAlreadyExistsException extends AbstractAlreadyExistsException {
    @Serial
    private static final long serialVersionUID = 408633533046225986L;

    public ProcessAlreadyExistsException() {
    }

    public ProcessAlreadyExistsException(String message) {
        super(message);
    }

    public ProcessAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }

    public ProcessAlreadyExistsException(Throwable cause) {
        super(cause);
    }

    public ProcessAlreadyExistsException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }

    public ProcessAlreadyExistsException(Map<String, Object> errors) {
        super(errors);
    }

    public ProcessAlreadyExistsException(String message, Map<String, Object> errors) {
        super(message, errors);
    }

    public ProcessAlreadyExistsException(String message, Throwable cause, Map<String, Object> errors) {
        super(message, cause, errors);
    }

    public ProcessAlreadyExistsException(Throwable cause, Map<String, Object> errors) {
        super(cause, errors);
    }

    public ProcessAlreadyExistsException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace, Map<String, Object> errors) {
        super(message, cause, enableSuppression, writableStackTrace, errors);
    }
}
