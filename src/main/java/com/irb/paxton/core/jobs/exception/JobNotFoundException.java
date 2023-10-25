package com.irb.paxton.core.jobs.exception;

import com.irb.paxton.exceptions.handler.common.AbstractNotFoundException;
import graphql.GraphQLError;

import java.io.Serial;

public class JobNotFoundException extends AbstractNotFoundException implements GraphQLError {

    @Serial
    private static final long serialVersionUID = -4482154162744550906L;

    public JobNotFoundException() {
    }

    public JobNotFoundException(String message) {
        super(message);
    }

    public JobNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public JobNotFoundException(Throwable cause) {
        super(cause);
    }

    public JobNotFoundException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
