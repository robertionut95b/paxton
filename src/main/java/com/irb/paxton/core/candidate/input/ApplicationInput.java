package com.irb.paxton.core.candidate.input;

import com.irb.paxton.core.model.input.AbstractInput;
import lombok.Data;

import javax.validation.constraints.NotNull;
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

    private Collection<ApplicationProcessStepsInput> processSteps;

    private OffsetDateTime dateOfApplication;
}
