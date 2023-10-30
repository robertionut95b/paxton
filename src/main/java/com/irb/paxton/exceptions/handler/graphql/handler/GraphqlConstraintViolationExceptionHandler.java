package com.irb.paxton.exceptions.handler.graphql.handler;

import com.irb.paxton.exceptions.handler.graphql.domain.GqlErrorDetails;
import com.irb.paxton.exceptions.handler.graphql.domain.GqlFieldError;
import com.irb.paxton.exceptions.handler.graphql.domain.GqlGlobalError;
import com.irb.paxton.exceptions.handler.graphql.domain.GqlParameterError;
import com.netflix.graphql.types.errors.ErrorType;
import graphql.GraphQLError;
import graphql.GraphqlErrorBuilder;
import graphql.execution.DataFetcherExceptionHandlerParameters;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.ElementKind;
import jakarta.validation.Path;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Component
@Slf4j
public class GraphqlConstraintViolationExceptionHandler implements GraphqlExceptionHandler {

    @Override
    public boolean canHandle(Throwable throwable) {
        return throwable instanceof ConstraintViolationException;
    }

    @Override
    public GraphQLError handleError(Throwable throwable, DataFetcherExceptionHandlerParameters handlerParameters) {
        ConstraintViolationException constraintViolationException = (ConstraintViolationException) throwable;
        Set<ConstraintViolation<?>> violations = constraintViolationException.getConstraintViolations();
        GqlErrorDetails gqlErrorDetails = new GqlErrorDetails();
        Map<String, Object> extensions = new HashMap<>();

        violations.stream()
                // sort violations to ensure deterministic order
                .sorted(Comparator.comparing(constraintViolation -> constraintViolation.getPropertyPath().toString()))
                .map(constraintViolation -> {
                    Optional<Path.Node> leafNode = getLeafNode(constraintViolation.getPropertyPath());
                    if (leafNode.isPresent()) {
                        Path.Node node = leafNode.get();
                        ElementKind elementKind = node.getKind();
                        if (elementKind == ElementKind.PROPERTY) {
                            return new GqlFieldError(node.toString(),
                                    constraintViolation.getMessage(),
                                    getPath(constraintViolation)
                            );
                        } else if (elementKind == ElementKind.BEAN) {
                            return new GqlGlobalError(
                                    constraintViolation.getMessage()
                            );
                        } else if (elementKind == ElementKind.PARAMETER) {
                            return new GqlParameterError(node.toString(),
                                    constraintViolation.getMessage()
                            );
                        } else {
                            log.warn("Unable to convert constraint violation with element kind {}: {}", elementKind, constraintViolation);
                            return null;
                        }
                    } else {
                        log.warn("Unable to convert constraint violation: {}", constraintViolation);
                        return null;
                    }
                })
                .forEach(error -> {
                    if (error instanceof GqlFieldError gqlFieldError) {
                        gqlErrorDetails.addFieldError(gqlFieldError);
                    } else if (error instanceof GqlGlobalError gqlGlobalError) {
                        gqlErrorDetails.addGlobalError(gqlGlobalError);
                    } else if (error != null) {
                        gqlErrorDetails.addParameterError((GqlParameterError) error);
                    }
                });

        extensions.put("errorDetails", gqlErrorDetails);

        return GraphqlErrorBuilder
                .newError()
                .errorType(ErrorType.BAD_REQUEST)
                .message("Validation error")
                .path(handlerParameters.getPath())
                .location(handlerParameters.getSourceLocation())
                .extensions(extensions)
                .build();
    }

    private Optional<Path.Node> getLeafNode(Path path) {
        return StreamSupport.stream(path.spliterator(), false).reduce((a, b) -> b);
    }

    private String getPath(ConstraintViolation<?> constraintViolation) {
        return getPathWithoutPrefix(constraintViolation.getPropertyPath());
    }

    private String getPathWithoutPrefix(Path path) {
        String collect = StreamSupport.stream(path.spliterator(), false)
                .limit(2)
                .map(Path.Node::getName)
                .collect(Collectors.joining("."));
        String substring = path.toString().substring(collect.length());
        return substring.startsWith(".") ? substring.substring(1) : substring;
    }
}
