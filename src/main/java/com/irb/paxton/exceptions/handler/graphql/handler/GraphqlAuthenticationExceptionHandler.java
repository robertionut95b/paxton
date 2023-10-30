package com.irb.paxton.exceptions.handler.graphql.handler;

import com.netflix.graphql.types.errors.ErrorType;
import graphql.GraphQLError;
import graphql.execution.DataFetcherExceptionHandlerParameters;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

@Component
public class GraphqlAuthenticationExceptionHandler implements GraphqlExceptionHandler {

    @Override
    public boolean canHandle(Throwable throwable) {
        return throwable instanceof AuthenticationException;
    }

    @Override
    public GraphQLError handleError(Throwable throwable, DataFetcherExceptionHandlerParameters handlerParameters) {
        return GraphQLError
                .newError()
                .errorType(ErrorType.UNAUTHENTICATED)
                .path(handlerParameters.getPath())
                .location(handlerParameters.getSourceLocation())
                .message(throwable.getMessage())
                .build();
    }
}
