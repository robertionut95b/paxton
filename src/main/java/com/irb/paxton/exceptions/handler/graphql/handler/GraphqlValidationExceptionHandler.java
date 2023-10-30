package com.irb.paxton.exceptions.handler.graphql.handler;

import com.irb.paxton.exceptions.handler.common.PaxtonValidationException;
import graphql.GraphQLError;
import graphql.execution.DataFetcherExceptionHandlerParameters;
import org.springframework.stereotype.Component;

@Component
public class GraphqlValidationExceptionHandler implements GraphqlExceptionHandler {

    @Override
    public boolean canHandle(Throwable throwable) {
        return throwable instanceof PaxtonValidationException;
    }

    @Override
    public GraphQLError handleError(Throwable throwable, DataFetcherExceptionHandlerParameters handlerParameters) {
        return GraphQLError
                .newError()
                .message(throwable.getMessage())
                .path(handlerParameters.getPath())
                .location(handlerParameters.getSourceLocation())
                .extensions(((PaxtonValidationException) throwable).getExtensions())
                .build();
    }
}
