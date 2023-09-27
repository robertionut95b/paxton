package com.irb.paxton.core.candidate.input;

import com.irb.paxton.core.model.input.AbstractInput;
import lombok.Data;

import jakarta.validation.constraints.NotNull;
import java.time.OffsetDateTime;

@Data
public class ApplicationProcessStepsInput extends AbstractInput {

    private Long id;

    @NotNull
    private Long processStepId;

    @NotNull
    private Long applicationId;

    private OffsetDateTime registeredAt;
}
