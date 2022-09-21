package com.irb.paxton.internals.healthcheck;

import graphql.kickstart.tools.GraphQLQueryResolver;
import org.springframework.stereotype.Component;

@Component
public class HealthQuery implements GraphQLQueryResolver {

    public String healthCheck() {
        return "OK";
    }
}
