package com.irb.paxton.core.candidate.input;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import javax.validation.constraints.NotNull;
import java.util.Collection;

@Data
@RequiredArgsConstructor
public class ApplicationInput {

    private Long id;

    @NotNull
    private Long userId;

    @NotNull
    private Long applicantProfileId;

    @NotNull
    private Long jobListingId;

    private Collection<ApplicationProcessStepsInput> processSteps;
}
