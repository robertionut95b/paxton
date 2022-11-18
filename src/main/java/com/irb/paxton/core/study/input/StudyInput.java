package com.irb.paxton.core.study.input;

import lombok.Data;
import org.springframework.lang.Nullable;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
public class StudyInput {

    private Long id;

    @NotNull
    private Long institution;

    private Long domainStudy;

    private String degree;

    private Long certification;

    private String description;

    @NotNull
    private LocalDate startDate = LocalDate.now();

    @Nullable
    private LocalDate endDate;

    @NotNull
    private String userProfileSlugUrl;
}
