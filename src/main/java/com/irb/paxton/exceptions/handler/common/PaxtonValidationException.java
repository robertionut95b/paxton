package com.irb.paxton.exceptions.handler.common;

import com.netflix.graphql.types.errors.ErrorType;
import graphql.ErrorClassification;
import graphql.GraphQLError;
import graphql.language.SourceLocation;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.io.Serial;
import java.io.Serializable;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ResponseStatus(HttpStatus.BAD_REQUEST)
@Getter
public class PaxtonValidationException extends PaxtonRuntimeException implements GraphQLError, Serializable {

    @Serial
    private static final long serialVersionUID = 1905122041950251207L;

    private Map<String, Object> errors;

    public PaxtonValidationException() {
    }

    public PaxtonValidationException(String message) {
        super(message);
    }

    public PaxtonValidationException(String message, Throwable cause) {
        super(message, cause);
    }

    public PaxtonValidationException(Throwable cause) {
        super(cause);
    }

    public PaxtonValidationException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }

    public PaxtonValidationException(Map<String, Object> errors) {
        this.errors = errors;
    }

    public PaxtonValidationException(String message, Map<String, Object> errors) {
        super(message);
        this.errors = errors;
    }

    public PaxtonValidationException(String message, Throwable cause, Map<String, Object> errors) {
        super(message, cause);
        this.errors = errors;
    }

    public PaxtonValidationException(Throwable cause, Map<String, Object> errors) {
        super(cause);
        this.errors = errors;
    }

    public PaxtonValidationException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace, Map<String, Object> errors) {
        super(message, cause, enableSuppression, writableStackTrace);
        this.errors = errors;
    }

    @Override
    public List<SourceLocation> getLocations() {
        return Collections.emptyList();
    }

    @Override
    public ErrorClassification getErrorType() {
        return ErrorType.BAD_REQUEST;
    }

    @Override
    public Map<String, Object> getExtensions() {
        Map<String, Object> extensions = GraphQLError.super.getExtensions() != null ? GraphQLError.super.getExtensions() : new HashMap<>();
        if (errors != null && errors.size() > 0) extensions.put("errorDetails", this.getErrors());
        return extensions;
    }
}
