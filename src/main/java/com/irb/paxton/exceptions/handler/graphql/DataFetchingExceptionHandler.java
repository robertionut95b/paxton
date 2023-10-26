package com.irb.paxton.exceptions.handler.graphql;

import com.irb.paxton.exceptions.handler.graphql.handler.GraphqlExceptionHandler;
import com.netflix.graphql.types.errors.ErrorType;
import com.netflix.graphql.types.errors.TypedGraphQLError;
import graphql.GraphQLError;
import graphql.execution.DataFetcherExceptionHandler;
import graphql.execution.DataFetcherExceptionHandlerParameters;
import graphql.execution.DataFetcherExceptionHandlerResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.NestedExceptionUtils;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Component
public class DataFetchingExceptionHandler implements DataFetcherExceptionHandler {

    private final List<GraphqlExceptionHandler> handlers;

    public DataFetchingExceptionHandler(List<GraphqlExceptionHandler> handlers) {
        this.handlers = handlers;
        log.info("Initialized GraphQL DataFetcherExceptionHandler with {} concrete handlers", handlers.size());
    }

    @Override
    public CompletableFuture<DataFetcherExceptionHandlerResult> handleException(DataFetcherExceptionHandlerParameters handlerParameters) {
        String uncaughtErrorMessage = "Unexpected error occurred";
        Throwable t = NestedExceptionUtils.getMostSpecificCause(handlerParameters.getException());
        TypedGraphQLError.Builder errorBuilder = TypedGraphQLError
                .newBuilder()
                .message(uncaughtErrorMessage)
                .path(handlerParameters.getPath())
                .errorType(t instanceof GraphQLError ? (ErrorType) ((GraphQLError) t).getErrorType() : ErrorType.INTERNAL);

        for (GraphqlExceptionHandler handler : handlers) {
            if (handler.canHandle(t)) {
                GraphQLError graphQLError = handler.handleError(t, errorBuilder);
                DataFetcherExceptionHandlerResult result = DataFetcherExceptionHandlerResult
                        .newResult(graphQLError)
                        .build();
                return CompletableFuture.completedFuture(result);
            }
        }
        log.error(uncaughtErrorMessage, handlerParameters.getException());

        GraphQLError graphqlError = errorBuilder.build();
        DataFetcherExceptionHandlerResult result = DataFetcherExceptionHandlerResult
                .newResult()
                .error(graphqlError)
                .build();

        return CompletableFuture.completedFuture(result);
    }
}
