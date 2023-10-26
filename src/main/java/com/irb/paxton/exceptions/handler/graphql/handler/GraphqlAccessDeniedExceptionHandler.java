package com.irb.paxton.exceptions.handler.graphql.handler;

import com.netflix.graphql.types.errors.ErrorType;
import com.netflix.graphql.types.errors.TypedGraphQLError;
import graphql.GraphQLError;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;

@Component
public class GraphqlAccessDeniedExceptionHandler implements GraphqlExceptionHandler {

    @Override
    public boolean canHandle(Throwable throwable) {
        return throwable instanceof AccessDeniedException;
    }

    @Override
    public GraphQLError handleError(Throwable throwable, TypedGraphQLError.Builder builder) {
        return builder
                .errorType(ErrorType.PERMISSION_DENIED)
                .message(throwable.getMessage())
                .build();
    }
}
