package com.irb.paxton.exceptions.handler.graphql.handler;

import com.irb.paxton.exceptions.handler.common.AbstractNotFoundException;
import com.netflix.graphql.types.errors.ErrorType;
import graphql.GraphQLError;
import graphql.execution.DataFetcherExceptionHandlerParameters;
import org.springframework.stereotype.Component;

@Component
public class GraphqlNotFoundExceptionHandler implements GraphqlExceptionHandler {

    @Override
    public boolean canHandle(Throwable throwable) {
        return throwable instanceof AbstractNotFoundException;
    }

    @Override
    public GraphQLError handleError(Throwable throwable, DataFetcherExceptionHandlerParameters handlerParameters) {
        return GraphQLError
                .newError()
                .errorType(ErrorType.NOT_FOUND)
                .path(handlerParameters.getPath())
                .location(handlerParameters.getSourceLocation())
                .message(throwable.getMessage())
                .build();
    }
}
