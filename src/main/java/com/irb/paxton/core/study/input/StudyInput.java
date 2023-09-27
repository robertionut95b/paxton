package com.irb.paxton.core.study.input;

import lombok.Data;
import org.springframework.lang.Nullable;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
public class StudyInput {

    private Long id;

    @NotNull
    private Long institution;

    @Nullable
    private Long domainStudy;

    @Nullable
    private String degree;

    @Nullable
    private Long certification;

    @Nullable
    private String description;

    @NotNull
    private LocalDate startDate = LocalDate.now();

    @Nullable
    private LocalDate endDate;

    @NotNull
    private String userProfileSlugUrl;
}
