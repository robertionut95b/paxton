package com.irb.paxton.core.process.resolver;

import com.irb.paxton.core.process.Step;
import com.irb.paxton.core.process.StepRepository;
import graphql.kickstart.tools.GraphQLQueryResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class StepQueryResolver implements GraphQLQueryResolver {

    @Autowired
    private StepRepository stepRepository;

    public List<Step> getAllSteps() {
        return this.stepRepository.findAll();
    }

    public List<Step> getStepsByProcess(Long processId) {
        return this.stepRepository.findByProcessSteps_ProcessId(processId);
    }
}