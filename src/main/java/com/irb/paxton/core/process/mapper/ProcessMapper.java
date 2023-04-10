package com.irb.paxton.core.process.mapper;

import com.irb.paxton.core.model.mapper.ReferenceMapper;
import com.irb.paxton.core.organization.Organization;
import com.irb.paxton.core.organization.OrganizationRepository;
import com.irb.paxton.core.organization.exception.OrganizationNotFoundException;
import com.irb.paxton.core.process.Process;
import com.irb.paxton.core.process.ProcessStepsRepository;
import com.irb.paxton.core.process.input.ProcessInput;
import com.irb.paxton.core.process.input.ProcessInputCreate;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collection;
import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        injectionStrategy = InjectionStrategy.CONSTRUCTOR, uses = {ProcessStepsMapper.class, ReferenceMapper.class})
public abstract class ProcessMapper {

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private ProcessStepsRepository processStepsRepository;

    @Mapping(target = "organizations", source = "processInput.organizationId")
    @Mapping(target = "processSteps", source = "processInput.processSteps")
    public abstract Process inputToProcess(ProcessInput processInput);

    public Collection<Organization> mapOrganization(Long organizationId) {
        return List.of(this.organizationRepository
                .findById(organizationId)
                .orElseThrow(() -> new OrganizationNotFoundException(String.format("Organization %s does not exist", organizationId))));
    }

    @Mapping(target = "organizations", source = "processInputUpdate.organizationId")
    @Mapping(target = "processSteps", source = "processInputUpdate.processSteps")
    public abstract Process inputToProcessUpdate(@MappingTarget Process process, ProcessInput processInputUpdate);

    @Mapping(target = "organizations", source = "processInput.organizationId")
    @Mapping(target = "processSteps", source = "processInput.processSteps")
    public abstract Process inputCreateToProcess(ProcessInputCreate processInput);
}
