package com.irb.paxton.security.auth.user.exceptions;

public class UserAlreadyExistsException extends Exception {

    public UserAlreadyExistsException(String message) {
        super(message);
    }

    public UserAlreadyExistsException(String message, Throwable err) {
        super(message, err);
    }
}
