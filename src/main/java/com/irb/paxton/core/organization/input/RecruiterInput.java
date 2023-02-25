package com.irb.paxton.core.organization.input;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * A DTO for the {@link com.irb.paxton.core.organization.Recruiter} entity
 */
@Data
@NoArgsConstructor
public class RecruiterInput implements Serializable {

    @NotNull
    private Long id;

    private Long organizationId;

    private boolean isActive;

    private LocalDateTime lastActive;
}
