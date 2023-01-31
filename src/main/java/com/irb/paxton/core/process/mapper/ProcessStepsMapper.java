package com.irb.paxton.core.process.mapper;

import com.irb.paxton.core.process.Process;
import com.irb.paxton.core.process.*;
import com.irb.paxton.core.process.exception.ProcessNotExistsException;
import com.irb.paxton.core.process.input.ProcessStepsInput;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class ProcessStepsMapper {

    @Autowired
    private StepRepository stepRepository;

    @Autowired
    private ProcessRepository processRepository;

    @Mapping(target = "step", source = "processStepsInput.stepId")
    @Mapping(target = "process", source = "processStepsInput.processId")
    @Mapping(target = "modifiedBy", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "applications", ignore = true)
    public abstract ProcessSteps inputToProcessSteps(ProcessStepsInput processStepsInput);

    public Step mapStep(Long stepId) {
        return this.stepRepository
                .findById(stepId)
                .orElseThrow(() -> new IllegalArgumentException(String.format("Step by id %s does not exist", stepId)));
    }

    public Process mapProcess(Long processId) {
        return this.processRepository
                .findById(processId)
                .orElseThrow(() -> new ProcessNotExistsException(String.format("Process by id %s does not exist", processId)));
    }
}
