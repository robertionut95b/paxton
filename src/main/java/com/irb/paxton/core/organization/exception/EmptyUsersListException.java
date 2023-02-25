package com.irb.paxton.core.organization.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class EmptyUsersListException extends RuntimeException {

    public EmptyUsersListException(String message) {
        super(message);
    }

    public EmptyUsersListException(String message, Throwable cause) {
        super(message, cause);
    }
}
