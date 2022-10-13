package com.irb.paxton.core.jobs.category.dto;

import com.irb.paxton.core.jobs.category.JobCategory;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.io.Serial;
import java.io.Serializable;

/**
 * A DTO for the {@link JobCategory} entity
 */
@Data
public class JobCategoryDto implements Serializable {

    @Serial
    private static final long serialVersionUID = 6768774534629112803L;

    @NotNull
    @NotEmpty
    @NotBlank
    private final String name;
}