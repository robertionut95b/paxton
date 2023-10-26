package com.irb.paxton.exceptions.handler.graphql.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class GqlFieldError {

    private final String property;

    private final String message;

    private final String path;
}
