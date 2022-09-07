package com.irb.paxton.security.auth.user.exceptions;

public class InvalidCredentialsException extends RuntimeException {

    public InvalidCredentialsException(String message) {
        super(message);
    }

    public InvalidCredentialsException(String message, Throwable err) {
        super(message, err);
    }
}
