package com.irb.paxton.core.study.certification.input;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Data
public class CertificationInput implements Serializable {

    @NotNull
    @NotEmpty
    @NotBlank
    private String name;
}
