package com.irb.paxton.internals.healthcheck;

import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;

@DgsComponent
public class HealthQueryResolver {

    @DgsQuery
    public String healthCheck() {
        return "OK";
    }
}
