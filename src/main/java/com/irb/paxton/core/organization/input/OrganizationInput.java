package com.irb.paxton.core.organization.input;

import com.irb.paxton.core.process.Process;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Data
public class OrganizationInput implements Serializable {

    private final Long id;

    @NotNull
    @NotBlank
    @NotEmpty
    private final String name;

    @NotNull
    @NotBlank
    @NotEmpty
    private final String description;

    @NotNull
    @NotBlank
    @NotEmpty
    private final String industry;

    @NotEmpty
    @NotNull
    @NotBlank
    private final String location;

    private final String photography;

    private final Process recruitmentProcess;
}