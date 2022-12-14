package com.irb.paxton.security.auth.token.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.io.Serial;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class TokenAlreadyExistsException extends RuntimeException {
    @Serial
    private static final long serialVersionUID = 4213164669212172778L;

    public TokenAlreadyExistsException(String message) {
        super(message);
    }

    public TokenAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }
}
