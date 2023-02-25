package com.irb.paxton.core.organization.exception;

import graphql.ErrorClassification;
import graphql.ErrorType;
import graphql.GraphQLError;
import graphql.language.SourceLocation;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
public class RecruiterExistingJobsException extends RuntimeException implements GraphQLError {

    private final String path;

    public RecruiterExistingJobsException(String message, String path) {
        super(message);
        this.path = path;
    }

    public RecruiterExistingJobsException(String message, String path, Throwable cause) {
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
        return Collections.singletonList(Optional.ofNullable(path));
    }
}
