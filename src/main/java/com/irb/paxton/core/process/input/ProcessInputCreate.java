package com.irb.paxton.core.process.input;

import com.irb.paxton.core.model.input.AbstractInput;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Data
public class ProcessInputCreate extends AbstractInput {

    private Long id;

    @NotNull
    @NotEmpty
    @NotBlank
    private String name;

    @NotNull
    @NotEmpty
    @NotBlank
    private String description;

    @NotNull
    private List<ProcessStepsInputCreate> processSteps;

    @NotNull
    private Long organizationId;
}
