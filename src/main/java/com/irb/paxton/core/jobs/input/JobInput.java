package com.irb.paxton.core.jobs.input;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

import java.io.Serial;
import java.io.Serializable;

@Data
public class JobInput implements Serializable {

    @Serial
    private static final long serialVersionUID = -8537064277048493944L;

    private Long id;

    @NotNull
    @NotEmpty
    @NotBlank
    @Length(min = 3, max = 25, message = "Name must be between {min} and {max} characters")
    private String name;

    @NotNull
    @NotBlank
    @NotEmpty
    @Length(min = 10, max = 100, message = "Description must be between {min} and {max} characters")
    private String description;
}
