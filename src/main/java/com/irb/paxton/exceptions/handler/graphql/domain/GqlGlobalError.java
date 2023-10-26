package com.irb.paxton.exceptions.handler.graphql.domain;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GqlGlobalError {

    private final String message;
}
