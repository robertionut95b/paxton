package com.irb.paxton.exceptions.handler.graphql.domain;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GqlParameterError {

    private final String parameter;

    private final String message;
}
