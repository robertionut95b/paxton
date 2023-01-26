package com.irb.paxton.core.organization.exception;

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

@ResponseStatus(HttpStatus.NOT_FOUND)
public class OrganizationNotExistsException extends RuntimeException implements GraphQLError {

    @Serial
    private static final long serialVersionUID = 7276059009498227434L;
    private String path;

    public OrganizationNotExistsException(String message) {
        super(message);
    }

    public OrganizationNotExistsException(String message, String path) {
        super(message);
        this.path = path;
    }

    public OrganizationNotExistsException(String message, Throwable cause) {
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
