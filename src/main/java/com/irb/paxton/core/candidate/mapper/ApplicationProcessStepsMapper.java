package com.irb.paxton.core.candidate.mapper;

import com.irb.paxton.core.candidate.Application;
import com.irb.paxton.core.candidate.ApplicationProcessSteps;
import com.irb.paxton.core.candidate.ApplicationRepository;
import com.irb.paxton.core.candidate.exception.ApplicationNotFoundException;
import com.irb.paxton.core.candidate.input.ApplicationProcessStepsInput;
import com.irb.paxton.core.model.mapper.ReferenceMapper;
import com.irb.paxton.core.process.ProcessSteps;
import com.irb.paxton.core.process.ProcessStepsRepository;
import com.irb.paxton.core.process.exception.ProcessNotFoundException;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring", uses = {ReferenceMapper.class})
public abstract class ApplicationProcessStepsMapper {

    @Autowired
    ProcessStepsRepository processStepsRepository;

    @Autowired
    ApplicationRepository applicationRepository;

    @Mapping(target = "processStep", source = "applicationProcessStepsInput.processStepId")
    @Mapping(target = "application", source = "applicationProcessStepsInput.applicationId")
    public abstract ApplicationProcessSteps toEntity(ApplicationProcessStepsInput applicationProcessStepsInput);

    @Mapping(target = "processStep", source = "applicationProcessStepsInput.processStepId")
    @Mapping(target = "application", source = "applicationProcessStepsInput.applicationId")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    public abstract ApplicationProcessSteps partialUpdate(ApplicationProcessStepsInput applicationProcessStepsInput, @MappingTarget ApplicationProcessSteps applicationProcessSteps);

    public ProcessSteps mapProcessStep(Long value) {
        return processStepsRepository.findById(value)
                .orElseThrow(() -> new ProcessNotFoundException("Process step by id %s does not exist".formatted(value)));
    }

    public Application mapApplication(Long value) {
        return applicationRepository.findById(value)
                .orElseThrow(() -> new ApplicationNotFoundException("Application by id %s does not exist".formatted(value)));
    }
}

