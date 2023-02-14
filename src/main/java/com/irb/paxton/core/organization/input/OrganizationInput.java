package com.irb.paxton.core.organization.input;

import com.irb.paxton.core.location.input.CityLookupInput;
import com.irb.paxton.core.organization.OrganizationSize;
import com.irb.paxton.core.organization.Specialization;
import com.irb.paxton.core.process.Process;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Collection;

@Data
public class OrganizationInput implements Serializable {

    @Serial
    private static final long serialVersionUID = -5715169150525722630L;

    private final Long id;

    @NotNull
    @NotBlank
    @NotEmpty
    private final String name;

    @NotNull
    @NotBlank
    @NotEmpty
    private final String slogan;

    @NotNull
    @NotBlank
    @NotEmpty
    private final String description;

    @NotNull
    private final Long activitySectorId;

    @NotNull
    private final Long headQuartersId;

    private final String photography;

    private final String webSite;

    private final Process recruitmentProcess;

    private final LocalDate foundedAt;
    
    private final OrganizationSize companySize;

    private final Collection<CityLookupInput> locations;

    private final Collection<Specialization> specializations;
}