package com.irb.paxton.internals.healthcheck;

import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;

@DgsComponent
public class HealthMutationResolver {

    @DgsQuery
    public String healthCheckPost() {
        return "OK";
    }
}
