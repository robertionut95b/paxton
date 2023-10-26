package com.irb.paxton.exceptions.handler.graphql.handler;

import com.irb.paxton.exceptions.handler.common.AbstractNotFoundException;
import com.netflix.graphql.types.errors.TypedGraphQLError;
import graphql.GraphQLError;
import org.springframework.stereotype.Component;

@Component
public class GraphqlNotFoundExceptionHandler implements GraphqlExceptionHandler {

    @Override
    public boolean canHandle(Throwable throwable) {
        return throwable instanceof AbstractNotFoundException;
    }

    @Override
    public GraphQLError handleError(Throwable throwable, TypedGraphQLError.Builder builder) {
        return builder
                .message(throwable.getMessage())
                .build();
    }
}
