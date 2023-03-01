package com.irb.paxton.core.jobs.category.exception;

import graphql.ErrorClassification;
import graphql.ErrorType;
import graphql.GraphQLError;
import graphql.language.SourceLocation;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.io.Serial;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class JobCategoryNotExistsException extends RuntimeException implements GraphQLError {

    @Serial
    private static final long serialVersionUID = 5960638623851594191L;

    private final String path;

    public JobCategoryNotExistsException(String message, String path) {
        super(message);
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
    public Map<String, Object> getExtensions() {
        return Collections.singletonMap("invalidField", path);
    }
}
