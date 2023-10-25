package com.irb.paxton.core.jobs.category.exception;

import com.irb.paxton.exceptions.handler.common.AbstractAlreadyExistsException;

import java.io.Serial;
import java.util.Map;

public class JobCategoryAlreadyExistsException extends AbstractAlreadyExistsException {

    @Serial
    private static final long serialVersionUID = 5960638623851594191L;

    public JobCategoryAlreadyExistsException() {
    }

    public JobCategoryAlreadyExistsException(String message) {
        super(message);
    }

    public JobCategoryAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }

    public JobCategoryAlreadyExistsException(Throwable cause) {
        super(cause);
    }

    public JobCategoryAlreadyExistsException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }

    public JobCategoryAlreadyExistsException(Map<String, Object> errors) {
        super(errors);
    }

    public JobCategoryAlreadyExistsException(String message, Map<String, Object> errors) {
        super(message, errors);
    }

    public JobCategoryAlreadyExistsException(String message, Throwable cause, Map<String, Object> errors) {
        super(message, cause, errors);
    }

    public JobCategoryAlreadyExistsException(Throwable cause, Map<String, Object> errors) {
        super(cause, errors);
    }

    public JobCategoryAlreadyExistsException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace, Map<String, Object> errors) {
        super(message, cause, enableSuppression, writableStackTrace, errors);
    }
}
