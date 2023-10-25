package com.irb.paxton.exceptions.handler.graphql;

import com.irb.paxton.exceptions.handler.common.AbstractNotFoundException;
import com.irb.paxton.exceptions.handler.common.PaxtonValidationException;
import com.netflix.graphql.types.errors.ErrorType;
import com.netflix.graphql.types.errors.TypedGraphQLError;
import graphql.GraphQLError;
import graphql.execution.DataFetcherExceptionHandler;
import graphql.execution.DataFetcherExceptionHandlerParameters;
import graphql.execution.DataFetcherExceptionHandlerResult;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.NestedExceptionUtils;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Slf4j
@Component
public class DataFetchingExceptionHandler implements DataFetcherExceptionHandler {

    @SuppressWarnings("unchecked")
    @Override
    public CompletableFuture<DataFetcherExceptionHandlerResult> handleException(DataFetcherExceptionHandlerParameters handlerParameters) {
        String uncaughtErrorMessage = "Unexpected error occurred";
        Throwable t = NestedExceptionUtils.getMostSpecificCause(handlerParameters.getException());
        Map<String, Object> debugInfo = new HashMap<>();
        TypedGraphQLError.Builder errorBuilder = TypedGraphQLError
                .newBuilder()
                .message(uncaughtErrorMessage)
                .debugInfo(debugInfo)
                .path(handlerParameters.getPath())
                .errorType(t instanceof GraphQLError ? (ErrorType) ((GraphQLError) t).getErrorType() : ErrorType.INTERNAL);

        if (t instanceof AbstractNotFoundException) {
            errorBuilder
                    .message(handlerParameters.getException().getMessage());
        } else if (t instanceof AuthenticationException) {
            errorBuilder
                    .errorType(ErrorType.UNAUTHENTICATED)
                    .message(handlerParameters.getException().getMessage());
        } else if (t instanceof AccessDeniedException) {
            errorBuilder
                    .errorType(ErrorType.PERMISSION_DENIED)
                    .message(handlerParameters.getException().getMessage());
        } else if (t instanceof PaxtonValidationException paxtonValidationException) {
            errorBuilder
                    .message(paxtonValidationException.getMessage())
                    .extensions(paxtonValidationException.getExtensions());
        } else if (t instanceof ConstraintViolationException constraintViolationException) {
            PaxtonValidationException validationException = new PaxtonValidationException(constraintViolationException.getMessage(),
                    constraintViolationException.getCause(),
                    constraintViolationException.getConstraintViolations()
                            .stream()
                            .collect(Collectors
                                    .toMap(cv -> cv.getPropertyPath().toString(), ConstraintViolation::getMessage, (l, r) -> {
                                        if (l instanceof List<?>) {
                                            ((List<Object>) l).add(r);
                                            return l;
                                        }
                                        return new ArrayList<>(List.of(l, r));
                                    })
                            )
            );
            errorBuilder
                    .errorType(ErrorType.BAD_REQUEST)
                    .message("Validation error")
                    .extensions(validationException.getExtensions());
        } else {
            log.error(uncaughtErrorMessage, handlerParameters.getException());
        }

        GraphQLError graphqlError = errorBuilder.build();
        DataFetcherExceptionHandlerResult result = DataFetcherExceptionHandlerResult
                .newResult()
                .error(graphqlError)
                .build();

        return CompletableFuture.completedFuture(result);
    }
}
