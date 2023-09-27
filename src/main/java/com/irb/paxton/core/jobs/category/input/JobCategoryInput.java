package com.irb.paxton.core.jobs.category.input;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

@Data
@RequiredArgsConstructor
public class JobCategoryInput {

    private Long id;

    @NotNull
    @NotBlank
    @NotEmpty
    private String name;
}
