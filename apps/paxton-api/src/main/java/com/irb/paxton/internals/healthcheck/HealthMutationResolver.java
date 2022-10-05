package com.irb.paxton.internals.healthcheck;

import graphql.kickstart.tools.GraphQLMutationResolver;
import org.springframework.stereotype.Controller;

@Controller
public class HealthMutationResolver implements GraphQLMutationResolver {

    public String healthCheckPost() {
        return "OK";
    }
}
