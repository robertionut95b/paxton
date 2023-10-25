package com.irb.paxton.core.organization.exception;

import com.irb.paxton.exceptions.handler.common.AbstractNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.io.Serial;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class OrganizationNotFoundException extends AbstractNotFoundException {

    @Serial
    private static final long serialVersionUID = 7276059009498227434L;

    public OrganizationNotFoundException() {
    }

    public OrganizationNotFoundException(String message) {
        super(message);
    }

    public OrganizationNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public OrganizationNotFoundException(Throwable cause) {
        super(cause);
    }

    public OrganizationNotFoundException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
