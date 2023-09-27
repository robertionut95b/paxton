package com.irb.paxton.exceptions.handler.graphql;

import com.irb.paxton.exceptions.handler.common.AbstractNotFoundException;
import com.irb.paxton.exceptions.handler.common.PaxtonRuntimeException;
import com.netflix.graphql.types.errors.ErrorType;
import com.netflix.graphql.types.errors.TypedGraphQLError;
import graphql.GraphQLError;
import graphql.execution.DataFetcherExceptionHandler;
import graphql.execution.DataFetcherExceptionHandlerParameters;
import graphql.execution.DataFetcherExceptionHandlerResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Component
public class DataFetchingExceptionHandler implements DataFetcherExceptionHandler {

    @Override
    public CompletableFuture<DataFetcherExceptionHandlerResult> handleException(DataFetcherExceptionHandlerParameters handlerParameters) {
        String uncaughtErrorMessage = "Unexpected error occurred";
        log.error(uncaughtErrorMessage, handlerParameters.getException());
        Map<String, Object> debugInfo = new HashMap<>();
        TypedGraphQLError.Builder errorBuilder = TypedGraphQLError
                .newBuilder()
                .message(uncaughtErrorMessage)
                .debugInfo(debugInfo)
                .path(handlerParameters.getPath())
                .errorType(ErrorType.INTERNAL);

        if (handlerParameters.getException() instanceof AbstractNotFoundException) {
            errorBuilder
                    .errorType(ErrorType.NOT_FOUND)
                    .message(handlerParameters.getException().getMessage());
        }

        if (handlerParameters.getException() instanceof AccessDeniedException) {
            errorBuilder
                    .errorType(ErrorType.PERMISSION_DENIED)
                    .message(handlerParameters.getException().getMessage());
        }

        if (handlerParameters.getException() instanceof PaxtonRuntimeException) {
            errorBuilder
                    .errorType(ErrorType.BAD_REQUEST)
                    .message(handlerParameters.getException().getMessage());
        }

        GraphQLError graphqlError = errorBuilder.build();
        DataFetcherExceptionHandlerResult result = DataFetcherExceptionHandlerResult
                .newResult()
                .error(graphqlError)
                .build();

        return CompletableFuture.completedFuture(result);
        //return DataFetcherExceptionHandler.super.handleException(handlerParameters);
    }
}
