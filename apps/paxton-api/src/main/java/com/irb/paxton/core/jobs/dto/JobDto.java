package com.irb.paxton.core.jobs.dto;

import com.irb.paxton.core.jobs.category.JobCategory;
import com.irb.paxton.core.jobs.contract.ContractType;
import com.irb.paxton.core.organization.Organization;
import lombok.Data;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.io.Serial;
import java.io.Serializable;

@Data
public class JobDto implements Serializable {

    @Serial
    private static final long serialVersionUID = 7284919327771311994L;

    @NotNull
    @NotEmpty
    @NotBlank
    private String name;

    @NotNull
    @NotBlank
    @NotEmpty
    @Min(value = 10)
    private String description;

    @NotNull
    private ContractType contractType;

    @NotNull
    private Organization organization;

    @NotNull
    private JobCategory category;
}
