package com.irb.paxton.core.profile.experience.input;

import com.irb.paxton.core.jobs.contract.ContractType;
import lombok.Data;
import org.springframework.lang.Nullable;

import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
public class ExperienceInput {

    private Long id;

    @NotNull
    @NotEmpty
    @NotBlank
    private String title;

    @Enumerated
    @NotNull
    private ContractType contractType;

    @NotNull
    private Long organizationId;

    @NotNull
    private LocalDate startDate;

    @Nullable
    private LocalDate endDate;

    @NotNull
    private Long activitySectorId;

    @NotNull
    @NotBlank
    @NotEmpty
    private String description;

    @NotNull
    private String userProfileSlugUrl;

    @NotNull
    private String city;
}
