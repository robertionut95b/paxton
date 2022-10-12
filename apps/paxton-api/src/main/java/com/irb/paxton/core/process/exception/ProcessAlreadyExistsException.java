package com.irb.paxton.core.process.exception;

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
public class ProcessAlreadyExistsException extends RuntimeException implements GraphQLError {
    @Serial
    private static final long serialVersionUID = 408633533046225986L;

    private String path;

    public ProcessAlreadyExistsException(String message) {
        super(message);
    }

    public ProcessAlreadyExistsException(String message, String path) {
        super(message);
        this.path = path;
    }

    public ProcessAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
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
