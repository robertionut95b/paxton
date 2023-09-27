package com.irb.paxton.core.process.resolver;

import com.irb.paxton.core.process.Step;
import com.irb.paxton.core.process.StepRepository;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@DgsComponent
public class StepQueryResolver {

    @Autowired
    private StepRepository stepRepository;

    @DgsQuery
    public List<Step> getAllSteps() {
        return this.stepRepository.findAll();
    }

    @DgsQuery
    public List<Step> getStepsByProcess(@InputArgument Long processId) {
        return this.stepRepository.findByProcessSteps_ProcessId(processId);
    }
}