package com.irb.paxton.config;

import graphql.scalars.ExtendedScalars;
import graphql.schema.GraphQLScalarType;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
public class GraphqlScalars {

    @Bean
    public GraphQLScalarType Date() {
        return ExtendedScalars.Date;
    }

    @Bean
    public GraphQLScalarType DateTime() {
        return ExtendedScalars.DateTime;
    }

    @Bean
    public GraphQLScalarType Url() {
        return ExtendedScalars.Url;
    }
}
