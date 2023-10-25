package com.irb.paxton.security.auth.user.exceptions;

import com.irb.paxton.exceptions.handler.common.AbstractAlreadyExistsException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.io.Serial;
import java.util.Map;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class UserAlreadyExistsException extends AbstractAlreadyExistsException {

    @Serial
    private static final long serialVersionUID = -2543621324092429137L;

    public UserAlreadyExistsException() {
    }

    public UserAlreadyExistsException(String message) {
        super(message);
    }

    public UserAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }

    public UserAlreadyExistsException(Throwable cause) {
        super(cause);
    }

    public UserAlreadyExistsException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }

    public UserAlreadyExistsException(Map<String, Object> errors) {
        super(errors);
    }

    public UserAlreadyExistsException(String message, Map<String, Object> errors) {
        super(message, errors);
    }

    public UserAlreadyExistsException(String message, Throwable cause, Map<String, Object> errors) {
        super(message, cause, errors);
    }

    public UserAlreadyExistsException(Throwable cause, Map<String, Object> errors) {
        super(cause, errors);
    }

    public UserAlreadyExistsException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace, Map<String, Object> errors) {
        super(message, cause, enableSuppression, writableStackTrace, errors);
    }
}
