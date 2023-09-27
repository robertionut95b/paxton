package com.irb.paxton.core.study.certification.input;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.io.Serializable;

@Data
public class CertificationInput implements Serializable {

    @NotNull
    @NotEmpty
    @NotBlank
    private String name;
}
