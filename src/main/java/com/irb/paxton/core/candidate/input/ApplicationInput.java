package com.irb.paxton.core.candidate.input;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@RequiredArgsConstructor
public class ApplicationInput {

    @NotNull
    private Long userId;

    @NotNull
    private Long applicantProfileId;

    @NotNull
    private Long jobListingId;
}
