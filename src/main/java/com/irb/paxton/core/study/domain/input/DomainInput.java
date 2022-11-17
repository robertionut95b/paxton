package com.irb.paxton.core.study.domain.input;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Data
public class DomainInput implements Serializable {

    @NotNull
    @NotEmpty
    @NotBlank
    private String name;
}
