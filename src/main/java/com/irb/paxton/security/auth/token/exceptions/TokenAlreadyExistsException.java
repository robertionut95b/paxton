package com.irb.paxton.security.auth.token.exceptions;

import com.irb.paxton.exceptions.handler.common.AbstractAlreadyExistsException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.io.Serial;
import java.util.Map;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class TokenAlreadyExistsException extends AbstractAlreadyExistsException {

    @Serial
    private static final long serialVersionUID = 4213164669212172778L;

    public TokenAlreadyExistsException() {
    }

    public TokenAlreadyExistsException(String message) {
        super(message);
    }

    public TokenAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }

    public TokenAlreadyExistsException(Throwable cause) {
        super(cause);
    }

    public TokenAlreadyExistsException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }

    public TokenAlreadyExistsException(Map<String, Object> errors) {
        super(errors);
    }

    public TokenAlreadyExistsException(String message, Map<String, Object> errors) {
        super(message, errors);
    }

    public TokenAlreadyExistsException(String message, Throwable cause, Map<String, Object> errors) {
        super(message, cause, errors);
    }

    public TokenAlreadyExistsException(Throwable cause, Map<String, Object> errors) {
        super(cause, errors);
    }

    public TokenAlreadyExistsException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace, Map<String, Object> errors) {
        super(message, cause, enableSuppression, writableStackTrace, errors);
    }
}
