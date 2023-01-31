package com.irb.paxton.core.process.mapper;

import com.irb.paxton.core.organization.Organization;
import com.irb.paxton.core.organization.OrganizationRepository;
import com.irb.paxton.core.organization.exception.OrganizationNotExistsException;
import com.irb.paxton.core.process.Process;
import com.irb.paxton.core.process.ProcessSteps;
import com.irb.paxton.core.process.ProcessStepsRepository;
import com.irb.paxton.core.process.exception.ProcessNotExistsException;
import com.irb.paxton.core.process.input.ProcessInput;
import com.irb.paxton.core.process.input.ProcessInputUpdate;
import org.jetbrains.annotations.NotNull;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collection;
import java.util.List;

@Mapper(componentModel = "spring", uses = {ProcessStepsMapper.class})
public abstract class ProcessMapper {

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private ProcessStepsRepository processStepsRepository;

    @Mapping(target = "organizations", source = "processInput.organizationId")
    @Mapping(target = "processSteps", source = "processInput.processSteps")
    @Mapping(target = "modifiedBy", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    public abstract Process inputToProcess(ProcessInput processInput);

    public Collection<Organization> mapOrganization(Long organizationId) {
        return List.of(this.organizationRepository
                .findById(organizationId)
                .orElseThrow(() -> new OrganizationNotExistsException(String.format("Organization %s does not exist", organizationId))));
    }

    @Mapping(target = "organizations", source = "processInputUpdate.organizationId")
    @Mapping(target = "processSteps", source = "processInputUpdate.processSteps")
    @Mapping(target = "modifiedBy", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    public abstract Process inputToProcessUpdate(@MappingTarget Process process, ProcessInputUpdate processInputUpdate);

    public Collection<ProcessSteps> mapProcessStepsUpdate(@NotNull List<Long> ids) {
        return ids.stream()
                .map(id -> processStepsRepository.findById(id)
                        .orElseThrow(() -> new ProcessNotExistsException(String.format("Process step by id %s does not exist", id))))
                .toList();
    }
}
