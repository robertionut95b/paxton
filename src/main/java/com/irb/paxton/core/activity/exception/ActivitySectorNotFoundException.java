package com.irb.paxton.core.activity.exception;

import com.irb.paxton.exceptions.handler.common.AbstractNotFoundException;
import graphql.ErrorClassification;
import graphql.ErrorType;
import graphql.GraphQLError;
import graphql.language.SourceLocation;

import java.io.Serial;
import java.util.List;

public class ActivitySectorNotFoundException extends AbstractNotFoundException implements GraphQLError {

    @Serial
    private static final long serialVersionUID = -8867336788992149667L;

    private final String path;

    public ActivitySectorNotFoundException(String message, String path) {
        super(message);
        this.path = path;
    }

    public ActivitySectorNotFoundException(String message, Throwable cause, String path) {
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
