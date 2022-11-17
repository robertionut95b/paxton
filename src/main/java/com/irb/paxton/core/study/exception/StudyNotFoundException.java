package com.irb.paxton.core.study.exception;

import graphql.ErrorClassification;
import graphql.ErrorType;
import graphql.GraphQLError;
import graphql.language.SourceLocation;

import java.util.List;

public class StudyNotFoundException extends RuntimeException implements GraphQLError {

    private final String path;

    public StudyNotFoundException(String message, String path) {
        super(message);
        this.path = path;
    }

    public StudyNotFoundException(String message, Throwable cause, String path) {
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
