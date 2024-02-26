package com.irb.paxton.exceptions.handler.graphql.handler;

import com.irb.paxton.core.search.exceptions.InvalidSearchSyntaxException;
import com.netflix.graphql.types.errors.ErrorType;
import graphql.GraphQLError;
import graphql.execution.DataFetcherExceptionHandlerParameters;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.QueryException;
import org.hibernate.query.sqm.PathElementException;
import org.hibernate.query.sqm.produce.function.FunctionArgumentException;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class GraphqlHibernateSqmExceptionHandler implements GraphqlExceptionHandler {

    @Override
    public boolean canHandle(Throwable throwable) {
        return throwable instanceof InvalidSearchSyntaxException
                || throwable instanceof PathElementException
                || throwable instanceof QueryException;
    }

    @Override
    public GraphQLError handleError(Throwable throwable, DataFetcherExceptionHandlerParameters handlerParameters) {
        log.error(throwable.getMessage(), throwable);
        return GraphQLError
                .newError()
                .errorType(ErrorType.BAD_REQUEST)
                .path(handlerParameters.getPath())
                .location(handlerParameters.getSourceLocation())
                .message(this.mapMessageToUserFriendlyString(throwable))
                .build();
    }

    public String mapMessageToUserFriendlyString(Throwable throwable) {
        if (throwable instanceof PathElementException) {
            return throwable.getMessage().split("' of '")[0] + "'";
        } else if (throwable instanceof FunctionArgumentException) {
            return "Invalid filter values";
        }
        return throwable.getMessage();
    }
}
