package com.irb.paxton.core.process.input;

import com.irb.paxton.core.process.Status;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class ProcessStepsInput {

    @NotNull
    private Long processId;

    @NotNull
    private Status status;

    @NotNull
    private Long stepId;

    @NotNull
    private int order;
}
