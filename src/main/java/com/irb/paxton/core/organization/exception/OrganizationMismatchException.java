package com.irb.paxton.core.organization.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class OrganizationMismatchException extends RuntimeException {

    public OrganizationMismatchException(String message) {
        super(message);
    }

    public OrganizationMismatchException(String message, Throwable cause) {
        super(message, cause);
    }
}
