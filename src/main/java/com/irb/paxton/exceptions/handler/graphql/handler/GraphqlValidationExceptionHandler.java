package com.irb.paxton.exceptions.handler.graphql.handler;

import com.irb.paxton.exceptions.handler.common.PaxtonValidationException;
import com.netflix.graphql.types.errors.TypedGraphQLError;
import graphql.GraphQLError;
import org.springframework.stereotype.Component;

@Component
public class GraphqlValidationExceptionHandler implements GraphqlExceptionHandler {

    @Override
    public boolean canHandle(Throwable throwable) {
        return throwable instanceof PaxtonValidationException;
    }

    @Override
    public GraphQLError handleError(Throwable throwable, TypedGraphQLError.Builder builder) {
        return builder
                .message(throwable.getMessage())
                .extensions(((PaxtonValidationException) throwable).getExtensions())
                .build();
    }
}
