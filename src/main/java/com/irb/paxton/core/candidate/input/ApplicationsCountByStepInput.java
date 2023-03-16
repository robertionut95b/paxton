package com.irb.paxton.core.candidate.input;

import com.irb.paxton.core.candidate.ApplicationStatus;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Data
public class ApplicationsCountByStepInput {

    @NotNull
    @NotBlank
    @NotEmpty
    private String stepTitle;

    private ApplicationStatus applicationStatus;

    private Integer page = 0;

    private Integer size = 10;
}
