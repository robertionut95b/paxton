package com.irb.paxton.internals.healthcheck;

import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;

@DgsComponent
public class HealthMutationResolver {

    @DgsMutation
    public String healthCheckPost() {
        return "OK";
    }
}
