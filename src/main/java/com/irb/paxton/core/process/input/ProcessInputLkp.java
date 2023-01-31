package com.irb.paxton.core.process.input;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class ProcessInputLkp {

    @NotNull
    @NotEmpty
    @NotBlank
    private String name;

    @NotNull
    @NotEmpty
    @NotBlank
    private String description;

    @NotNull
    private List<Long> processSteps;

    @NotNull
    private Long organizationId;
}
