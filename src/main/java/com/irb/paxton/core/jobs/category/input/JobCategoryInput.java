package com.irb.paxton.core.jobs.category.input;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Data
@RequiredArgsConstructor
public class JobCategoryInput {

    private Long id;

    @NotNull
    @NotBlank
    @NotEmpty
    private String name;
}
