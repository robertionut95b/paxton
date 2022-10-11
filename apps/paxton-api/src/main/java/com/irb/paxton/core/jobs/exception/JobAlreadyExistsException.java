package com.irb.paxton.core.jobs.exception;

import graphql.ErrorClassification;
import graphql.ErrorType;
import graphql.GraphQLError;
import graphql.language.SourceLocation;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.io.Serial;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class JobAlreadyExistsException extends RuntimeException implements GraphQLError {

    @Serial
    private static final long serialVersionUID = 1803708763847314597L;
    private String path;

    public JobAlreadyExistsException(String message) {
        super(message);
    }

    public JobAlreadyExistsException(String message, String path) {
        super(message);
        this.path = path;
    }

    public JobAlreadyExistsException(String message, Throwable cause) {
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
