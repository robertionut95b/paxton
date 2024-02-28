package com.irb.paxton.exceptions.handler.graphql.handler;

import com.netflix.graphql.types.errors.ErrorType;
import graphql.GraphQLError;
import graphql.execution.DataFetcherExceptionHandlerParameters;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.type.descriptor.java.CoercionException;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeParseException;

@Slf4j
@Component
public class GraphqlFormatExceptionHandler implements GraphqlExceptionHandler {

    @Override
    public boolean canHandle(Throwable throwable) {
        return throwable instanceof NumberFormatException ||
                throwable instanceof DateTimeParseException ||
                throwable instanceof CoercionException;
    }

    @Override
    public GraphQLError handleError(Throwable throwable, DataFetcherExceptionHandlerParameters handlerParameters) {
        log.error(throwable.getMessage(), throwable);
        return GraphQLError
                .newError()
                .errorType(ErrorType.BAD_REQUEST)
                .path(handlerParameters.getPath())
                .location(handlerParameters.getSourceLocation())
                .message("Could not parse value, invalid data type")
                .build();
    }
}
