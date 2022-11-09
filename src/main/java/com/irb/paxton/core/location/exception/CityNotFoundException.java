package com.irb.paxton.core.location.exception;

import graphql.ErrorClassification;
import graphql.ErrorType;
import graphql.GraphQLError;
import graphql.language.SourceLocation;

import java.io.Serial;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

public class CityNotFoundException extends RuntimeException implements GraphQLError {

    @Serial
    private static final long serialVersionUID = 8056432388593090725L;

    private final String path;

    public CityNotFoundException(String message, String path) {
        super(message);
        this.path = path;
    }

    public CityNotFoundException(String message, Throwable cause, String path) {
        super(message, cause);
        this.path = path;
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
