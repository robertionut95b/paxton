package com.irb.paxton.exceptions.handler;

import com.irb.paxton.exceptions.handler.common.AbstractNotFoundException;
import graphql.ErrorType;
import graphql.ExceptionWhileDataFetching;
import graphql.GraphQLError;
import graphql.GraphqlErrorBuilder;
import graphql.kickstart.execution.error.GraphQLErrorHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.TransactionSystemException;

import javax.persistence.RollbackException;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import java.util.List;
import java.util.Set;

@Component
@Slf4j
public class GraphQLExceptionHandler implements GraphQLErrorHandler {
    @Override
    public boolean errorsPresent(List<GraphQLError> errors) {
        return GraphQLErrorHandler.super.errorsPresent(errors);
    }

    @Override
    public List<GraphQLError> processErrors(List<GraphQLError> list) {
        return list.stream().map(this::getNested).toList();
    }

    private GraphQLError getNested(GraphQLError error) {
        if (error instanceof ExceptionWhileDataFetching exceptionError) {
            // handle all Graphql data fetching specific errors
            if (exceptionError.getException() instanceof GraphQLError) {
                return (GraphQLError) exceptionError.getException();
            }
            // handle all non-graphql errors
            GraphqlErrorBuilder<?> errorBuilder = GraphqlErrorBuilder.newError()
                    .extensions(error.getExtensions())
                    .errorType(error.getErrorType())
                    .locations(error.getLocations())
                    .path(error.getPath());

            if (exceptionError.getException() instanceof AbstractNotFoundException abstractNotFoundException) {
                return errorBuilder
                        .message(abstractNotFoundException.getMessage())
                        .build();
            }

            if (exceptionError.getException() instanceof ConstraintViolationException violationException) {
                return errorBuilder
                        .message(violationException.getMessage())
                        .build();
            }

            if (exceptionError.getException() instanceof InvalidDataAccessApiUsageException accessApiUsageException) {
                if (accessApiUsageException.getCause() instanceof IllegalArgumentException illegalArgumentException) {
                    return errorBuilder
                            .message(illegalArgumentException.getLocalizedMessage())
                            .errorType(ErrorType.NullValueInNonNullableField)
                            .build();
                }
                return errorBuilder
                        .message(accessApiUsageException.getCause().getLocalizedMessage())
                        .build();
            }

            if (exceptionError.getException() instanceof TransactionSystemException transactionSystemException) {
                if (transactionSystemException.getCause() instanceof RollbackException rollbackException) {
                    if (rollbackException.getCause() instanceof ConstraintViolationException constraintViolationException) {
                        return errorBuilder
                                .message(this.buildValidationErrors(constraintViolationException.getConstraintViolations()).toString())
                                .build();
                    }
                }
            }
        }
        return error;
    }

    private List<String> buildValidationErrors(Set<ConstraintViolation<?>> violations) {
        return violations
                .stream()
                .map(violation -> "{field: '%s', error: '%s'}".formatted(violation.getPropertyPath(), violation.getMessage()))
                .toList();
    }
}
