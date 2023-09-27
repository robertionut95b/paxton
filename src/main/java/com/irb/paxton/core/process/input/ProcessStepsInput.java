package com.irb.paxton.core.process.input;

import com.irb.paxton.core.model.input.AbstractInput;
import com.irb.paxton.core.process.Status;
import lombok.Data;

import jakarta.validation.constraints.NotNull;

@Data
public class ProcessStepsInput extends AbstractInput {

    private Long id;

    @NotNull
    private Long processId;

    @NotNull
    private Status status;

    @NotNull
    private Long stepId;

    @NotNull
    private int order;
}
