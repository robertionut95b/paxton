package com.irb.paxton.core.candidate.input;

import com.irb.paxton.core.candidate.ApplicationStatus;
import com.irb.paxton.core.candidate.validator.OrderedProcessSteps;
import com.irb.paxton.core.candidate.validator.ValidOrganizationProcessSteps;
import com.irb.paxton.core.model.input.AbstractInput;
import lombok.Data;

import jakarta.validation.constraints.NotNull;
import java.time.OffsetDateTime;
import java.util.Collection;

@Data
public class ApplicationInput extends AbstractInput {

    private Long id;

    @NotNull
    private Long userId;

    @NotNull
    private Long applicantProfileId;

    @NotNull
    private Long jobListingId;

    private ApplicationStatus status = ApplicationStatus.IN_PROGRESS;

    @ValidOrganizationProcessSteps
    @OrderedProcessSteps
    private Collection<ApplicationProcessStepsInput> processSteps;

    private OffsetDateTime dateOfApplication = OffsetDateTime.now();
}
