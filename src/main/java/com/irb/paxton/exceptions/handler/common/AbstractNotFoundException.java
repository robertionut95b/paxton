package com.irb.paxton.exceptions.handler.common;

import com.netflix.graphql.types.errors.ErrorType;
import graphql.ErrorClassification;
import graphql.GraphQLError;
import graphql.language.SourceLocation;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;
import java.util.Map;

@ResponseStatus(HttpStatus.NOT_FOUND)
public abstract class AbstractNotFoundException extends PaxtonRuntimeException implements GraphQLError {

    protected AbstractNotFoundException() {
    }

    protected AbstractNotFoundException(String message) {
        super(message);
    }

    protected AbstractNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    protected AbstractNotFoundException(Throwable cause) {
        super(cause);
    }

    protected AbstractNotFoundException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }

    @Override
    public ErrorClassification getErrorType() {
        return ErrorType.NOT_FOUND;
    }

    @Override
    public Map<String, Object> getExtensions() {
        return GraphQLError.super.getExtensions();
    }

    @Override
    public List<SourceLocation> getLocations() {
        return null;
    }
}
