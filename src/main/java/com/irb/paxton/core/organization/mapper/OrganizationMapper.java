package com.irb.paxton.core.organization.mapper;

import com.irb.paxton.core.activity.ActivitySector;
import com.irb.paxton.core.activity.ActivitySectorRepository;
import com.irb.paxton.core.activity.exception.ActivitySectorNotFoundException;
import com.irb.paxton.core.location.City;
import com.irb.paxton.core.location.CityRepository;
import com.irb.paxton.core.location.exception.CityNotFoundException;
import com.irb.paxton.core.model.PaxtonEntity;
import com.irb.paxton.core.organization.Organization;
import com.irb.paxton.core.organization.input.OrganizationInput;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collection;
import java.util.stream.Collectors;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring")
public abstract class OrganizationMapper {

    @Autowired
    private CityRepository cityRepository;

    @Autowired
    private ActivitySectorRepository activitySectorRepository;

    @Mapping(target = "slugName", ignore = true)
    @Mapping(target = "headQuarters", source = "organizationInput.headQuartersId")
    @Mapping(target = "affiliates", ignore = true)
    @Mapping(target = "activitySector", source = "organizationInput.activitySectorId")
    @Mapping(target = "recruiters", ignore = true)
    @Mapping(target = "modifiedBy", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "jobs", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "id", ignore = true)
    public abstract Organization organizationInputToOrganization(OrganizationInput organizationInput);

    public City mapCity(Long cityId) {
        return cityRepository.findById(cityId)
                .orElseThrow(() -> new CityNotFoundException("City %s does not exist".formatted(cityId)));
    }

    public ActivitySector mapActivitySector(Long activitySectorId) {
        return activitySectorRepository.findById(activitySectorId)
                .orElseThrow(() -> new ActivitySectorNotFoundException("Activity sector %s does not exist".formatted(activitySectorId)));
    }

    public Collection<Long> mapCities(Collection<City> value) {
        return value.stream().map(PaxtonEntity::getId).collect(Collectors.toList());
    }

    public abstract OrganizationInput organizationToOrganizationInput(Organization organization);

    @Mapping(target = "slugName", ignore = true)
    @Mapping(target = "headQuarters", source = "organizationInput.headQuartersId")
    @Mapping(target = "affiliates", ignore = true)
    @Mapping(target = "activitySector", source = "organizationInput.activitySectorId")
    @Mapping(target = "recruiters", ignore = true)
    @Mapping(target = "modifiedBy", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "jobs", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    public abstract void updateOrganizationFromOrganizationInput(OrganizationInput organizationInput, @MappingTarget Organization organization);
}
