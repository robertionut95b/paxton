package com.irb.paxton.exceptions.handler.graphql.handler;

import graphql.GraphQLError;
import graphql.execution.DataFetcherExceptionHandlerParameters;

public interface GraphqlExceptionHandler {

    boolean canHandle(Throwable throwable);

    GraphQLError handleError(Throwable throwable, DataFetcherExceptionHandlerParameters handlerParameters);
}
