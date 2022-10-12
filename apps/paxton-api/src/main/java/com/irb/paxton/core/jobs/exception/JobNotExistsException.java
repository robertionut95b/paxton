package com.irb.paxton.core.jobs.exception;

import graphql.ErrorClassification;
import graphql.ErrorType;
import graphql.GraphQLError;
import graphql.language.SourceLocation;

import java.io.Serial;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

public class JobNotExistsException extends RuntimeException implements GraphQLError {

    @Serial
    private static final long serialVersionUID = -4482154162744550906L;
    private String path;

    public JobNotExistsException(String message) {
        super(message);
    }

    public JobNotExistsException(String message, String path) {
        super(message);
        this.path = path;
    }

    public JobNotExistsException(String message, Throwable cause) {
        super(message, cause);
    }

    @Override
    public List<Object> getPath() {
        return Collections.singletonList(Optional.ofNullable(path));
    }

    @Override
    public List<SourceLocation> getLocations() {
        return null;
    }

    @Override
    public ErrorClassification getErrorType() {
        return ErrorType.ValidationError;
    }
}
