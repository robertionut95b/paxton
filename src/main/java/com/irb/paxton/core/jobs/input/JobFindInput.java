package com.irb.paxton.core.jobs.input;

import lombok.Data;
import org.springframework.lang.Nullable;

import jakarta.validation.constraints.NotNull;
import java.io.Serializable;

@Data
public class JobFindInput implements Serializable {

    @NotNull
    private final int pageNumber = 1;

    @NotNull
    private final int pageSize = 10;

    @Nullable
    private String filters;
}
