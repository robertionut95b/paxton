package com.irb.paxton.security.auth.user.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.io.Serial;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InactiveUserException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 3350631018655292512L;

    public InactiveUserException(String message) {
        super(message);
    }

    public InactiveUserException(String message, Throwable cause) {
        super(message, cause);
    }
}
