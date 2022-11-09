package com.irb.paxton.core.activity.exception;

import graphql.ErrorClassification;
import graphql.ErrorType;
import graphql.GraphQLError;
import graphql.language.SourceLocation;

import java.io.Serial;
import java.util.List;

public class ActivitySectorNotExistsException extends RuntimeException implements GraphQLError {

    @Serial
    private static final long serialVersionUID = -8867336788992149667L;

    private final String path;

    public ActivitySectorNotExistsException(String message, String path) {
        super(message);
        this.path = path;
    }

    public ActivitySectorNotExistsException(String message, Throwable cause, String path) {
        super(message, cause);
        this.path = path;
    }

    @Override
    public List<SourceLocation> getLocations() {
        return null;
    }

    @Override
    public ErrorClassification getErrorType() {
        return ErrorType.ValidationError;
    }

    @Override
    public List<Object> getPath() {
        return GraphQLError.super.getPath();
    }
}
