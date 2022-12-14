package com.irb.paxton.core.jobs.input;

import com.irb.paxton.core.jobs.contract.ContractType;
import lombok.Data;

import javax.persistence.Enumerated;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;

@Data
public class JobListingInput implements Serializable {

    @Serial
    private static final long serialVersionUID = -2048899776051052428L;

    @NotNull
    private LocalDate availableFrom;

    @NotNull
    private LocalDate availableTo;

    @NotNull
    @NotEmpty
    @NotBlank
    private String location;

    @NotNull
    private Long jobId;

    @NotNull
    private Integer numberOfVacancies = 1;

    @Enumerated
    @NotNull
    private ContractType contractType;

    @NotNull
    private Long organizationId;

    @NotNull
    private Long categoryId;

    @NotNull
    @NotEmpty
    @NotBlank
    private String title;

    @NotNull
    @NotEmpty
    @NotBlank
    private String description;
}
