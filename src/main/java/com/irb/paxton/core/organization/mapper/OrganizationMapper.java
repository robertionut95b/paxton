package com.irb.paxton.core.organization.mapper;

import com.irb.paxton.core.organization.Organization;
import com.irb.paxton.core.organization.input.OrganizationInput;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring")
public interface OrganizationMapper {

    @Mapping(target = "recruiters", ignore = true)
    @Mapping(target = "modifiedBy", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "jobs", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "id", ignore = true)
    Organization organizationInputToOrganization(OrganizationInput organizationInput);

    OrganizationInput organizationToOrganizationInput(Organization organization);

    @Mapping(target = "recruiters", ignore = true)
    @Mapping(target = "modifiedBy", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "jobs", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Organization updateOrganizationFromOrganizationInput(OrganizationInput organizationInput, @MappingTarget Organization organization);
}
