package com.irb.paxton.exceptions.handler.graphql.handler;

import com.netflix.graphql.types.errors.ErrorType;
import com.netflix.graphql.types.errors.TypedGraphQLError;
import graphql.GraphQLError;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

@Component
public class GraphqlAuthenticationExceptionHandler implements GraphqlExceptionHandler {

    @Override
    public boolean canHandle(Throwable throwable) {
        return throwable instanceof AuthenticationException;
    }

    @Override
    public GraphQLError handleError(Throwable throwable, TypedGraphQLError.Builder builder) {
        return builder
                .errorType(ErrorType.UNAUTHENTICATED)
                .message(throwable.getMessage())
                .build();
    }
}
