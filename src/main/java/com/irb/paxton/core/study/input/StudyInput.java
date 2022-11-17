package com.irb.paxton.core.study.input;

import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class StudyInput {

    private Long id;

    @NotNull
    private Long institutionId;

    private Long domainStudyId;

    private String degree;

    private Long certificationId;

    private String description;

    @NotNull
    private String userProfileSlugUrl;
}
