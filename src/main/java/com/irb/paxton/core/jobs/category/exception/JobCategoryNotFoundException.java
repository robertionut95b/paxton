package com.irb.paxton.core.jobs.category.exception;

import com.irb.paxton.exceptions.handler.common.AbstractNotFoundException;
import graphql.GraphQLError;

import java.io.Serial;

public class JobCategoryNotFoundException extends AbstractNotFoundException implements GraphQLError {

    @Serial
    private static final long serialVersionUID = 5960638623851594191L;

    public JobCategoryNotFoundException() {
    }

    public JobCategoryNotFoundException(String message) {
        super(message);
    }

    public JobCategoryNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public JobCategoryNotFoundException(Throwable cause) {
        super(cause);
    }

    public JobCategoryNotFoundException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
