package com.irb.paxton.core.location.exception;

import com.irb.paxton.exceptions.handler.common.AbstractNotFoundException;
import graphql.GraphQLError;

import java.io.Serial;

public class CityNotFoundException extends AbstractNotFoundException implements GraphQLError {

    @Serial
    private static final long serialVersionUID = 8056432388593090725L;

    public CityNotFoundException() {
    }

    public CityNotFoundException(String message) {
        super(message);
    }

    public CityNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public CityNotFoundException(Throwable cause) {
        super(cause);
    }

    public CityNotFoundException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
