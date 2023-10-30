package com.irb.paxton.exceptions.handler.graphql.handler;

import com.netflix.graphql.types.errors.ErrorType;
import graphql.GraphQLError;
import graphql.GraphqlErrorBuilder;
import graphql.execution.DataFetcherExceptionHandlerParameters;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;

@Component
public class GraphqlAccessDeniedExceptionHandler implements GraphqlExceptionHandler {

    @Override
    public boolean canHandle(Throwable throwable) {
        return throwable instanceof AccessDeniedException;
    }

    @Override
    public GraphQLError handleError(Throwable throwable, DataFetcherExceptionHandlerParameters handlerParameters) {
        return GraphqlErrorBuilder
                .newError()
                .errorType(ErrorType.PERMISSION_DENIED)
                .path(handlerParameters.getPath())
                .location(handlerParameters.getSourceLocation())
                .message(throwable.getMessage())
                .build();
    }
}
