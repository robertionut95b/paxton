package com.irb.paxton.core.process.mapper;

import com.irb.paxton.core.model.mapper.ReferenceMapper;
import com.irb.paxton.core.process.Process;
import com.irb.paxton.core.process.*;
import com.irb.paxton.core.process.exception.ProcessNotFoundException;
import com.irb.paxton.core.process.input.ProcessStepsInput;
import com.irb.paxton.core.process.input.ProcessStepsInputCreate;
import com.irb.paxton.exceptions.handler.common.GenericEntityNotFoundException;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        injectionStrategy = InjectionStrategy.CONSTRUCTOR, uses = {ReferenceMapper.class})
public abstract class ProcessStepsMapper {

    @Autowired
    private StepRepository stepRepository;

    @Autowired
    private ProcessRepository processRepository;

    @Mapping(target = "step", source = "processStepsInput.stepId")
    @Mapping(target = "process", source = "processStepsInput.processId")
    public abstract ProcessSteps inputToProcessSteps(ProcessStepsInput processStepsInput);

    public Step mapStep(Long stepId) {
        return this.stepRepository
                .findById(stepId)
                .orElseThrow(() -> new GenericEntityNotFoundException(String.format("Step by id %s does not exist", stepId)));
    }

    public Process mapProcess(Long processId) {
        return this.processRepository
                .findById(processId)
                .orElseThrow(() -> new ProcessNotFoundException(String.format("Process by id %s does not exist", processId)));
    }

    @Mapping(target = "step", source = "processStepsInputCreate.stepId")
    public abstract ProcessSteps inputToProcessSteps(ProcessStepsInputCreate processStepsInputCreate);
}
