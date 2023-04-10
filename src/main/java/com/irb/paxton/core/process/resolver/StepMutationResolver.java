package com.irb.paxton.core.process.resolver;

import com.irb.paxton.core.process.Step;
import com.irb.paxton.core.process.StepService;
import com.irb.paxton.core.process.input.StepInput;
import graphql.kickstart.tools.GraphQLMutationResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class StepMutationResolver implements GraphQLMutationResolver {

    @Autowired
    private StepService stepService;

    Step createStep(StepInput stepInput) {
        return this.stepService.createStep(stepInput);
    }
}
