package com.irb.paxton.core.profile.exception;

import com.irb.paxton.exceptions.handler.common.AbstractNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.io.Serial;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class UserProfileNotFoundException extends AbstractNotFoundException {

    @Serial
    private static final long serialVersionUID = 6279111236144163855L;

    public UserProfileNotFoundException() {
    }

    public UserProfileNotFoundException(String message) {
        super(message);
    }

    public UserProfileNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public UserProfileNotFoundException(Throwable cause) {
        super(cause);
    }

    public UserProfileNotFoundException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
