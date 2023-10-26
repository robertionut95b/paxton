package com.irb.paxton.exceptions.handler.graphql.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class GqlErrorDetails {

    private final Map<String, Object> properties;

    private final List<GqlFieldError> fieldErrors;

    private final List<GqlGlobalError> globalErrors;

    private final List<GqlParameterError> parameterErrors;

    public GqlErrorDetails() {
        properties = new HashMap<>();
        fieldErrors = new ArrayList<>();
        globalErrors = new ArrayList<>();
        parameterErrors = new ArrayList<>();
    }

    public void addErrorProperties(Map<String, Object> errorProperties) {
        properties.putAll(errorProperties);
    }

    public void addErrorProperty(String propertyName, Object propertyValue) {
        properties.put(propertyName, propertyValue);
    }

    public void addFieldError(GqlFieldError fieldError) {
        fieldErrors.add(fieldError);
    }

    public void addGlobalError(GqlGlobalError globalError) {
        globalErrors.add(globalError);
    }

    public void addParameterError(GqlParameterError parameterError) {
        parameterErrors.add(parameterError);
    }
}
