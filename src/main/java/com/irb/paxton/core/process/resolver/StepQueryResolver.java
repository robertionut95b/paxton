package com.irb.paxton.core.process.resolver;

import com.irb.paxton.core.process.Step;
import com.irb.paxton.core.process.StepRepository;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;

import java.util.List;

@DgsComponent
public class StepQueryResolver {

    private final StepRepository stepRepository;

    public StepQueryResolver(StepRepository stepRepository) {
        this.stepRepository = stepRepository;
    }

    @DgsQuery
    public List<Step> getAllSteps() {
        return this.stepRepository.findAll();
    }

    @DgsQuery
    public List<Step> getStepsByProcess(@InputArgument Long processId) {
        return this.stepRepository.findByProcessSteps_ProcessId(processId);
    }
}