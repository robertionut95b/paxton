package com.irb.paxton.security.auth.user.exceptions;

import com.irb.paxton.exceptions.handler.common.AbstractNotFoundException;

import java.io.Serial;

public class UserNotFoundException extends AbstractNotFoundException {

    @Serial
    private static final long serialVersionUID = 5715942379872832263L;

    public UserNotFoundException(String message) {
        super(message);
    }

    public UserNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
