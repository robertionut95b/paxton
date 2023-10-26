package com.irb.paxton.exceptions.handler.graphql.handler;

import com.netflix.graphql.types.errors.TypedGraphQLError;
import graphql.GraphQLError;

public interface GraphqlExceptionHandler {

    boolean canHandle(Throwable throwable);

    GraphQLError handleError(Throwable throwable, TypedGraphQLError.Builder builder);
}
