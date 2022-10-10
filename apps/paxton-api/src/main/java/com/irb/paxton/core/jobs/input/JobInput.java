package com.irb.paxton.core.jobs.input;

import com.irb.paxton.core.jobs.contract.ContractType;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.io.Serial;
import java.io.Serializable;

@Data
public class JobInput implements Serializable {

    @Serial
    private static final long serialVersionUID = -8537064277048493944L;

    @NotNull
    @NotEmpty
    @NotBlank
    private String name;

    @NotNull
    @NotBlank
    @NotEmpty
    @Length(min = 10, message = "Description must be longer than 10 characters")
    private String description;

    @NotNull
    private ContractType contractType;

    @NotNull
    private Long organizationId;

    @NotNull
    private Long jobCategoryId;
}
