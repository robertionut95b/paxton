package com.irb.paxton.core.profile.exception;

import com.irb.paxton.exceptions.handler.common.AbstractNotFoundException;
import graphql.ErrorClassification;
import graphql.ErrorType;
import graphql.GraphQLError;
import graphql.language.SourceLocation;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.io.Serial;
import java.util.List;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class UserProfileNotFoundException extends AbstractNotFoundException implements GraphQLError {

    @Serial
    private static final long serialVersionUID = 6279111236144163855L;
    private final String path;

    public UserProfileNotFoundException(String message, String path) {
        super(message);
        this.path = path;
    }

    public UserProfileNotFoundException(String message, Throwable cause, String path) {
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
