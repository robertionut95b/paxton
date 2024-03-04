package com.irb.paxton.core.process.resolver;

import com.irb.paxton.core.process.Step;
import com.irb.paxton.core.process.StepService;
import com.irb.paxton.core.process.input.StepInput;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.InputArgument;

@DgsComponent
public class StepMutationResolver {

    private final StepService stepService;

    public StepMutationResolver(StepService stepService) {
        this.stepService = stepService;
    }

    @DgsMutation
    public Step createStep(@InputArgument StepInput stepInput) {
        return this.stepService.createStep(stepInput);
    }
}
