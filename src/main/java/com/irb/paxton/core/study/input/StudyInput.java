package com.irb.paxton.core.study.input;

import lombok.Data;

import javax.validation.constraints.NotNull;

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
    private String userProfileSlugUrl;
}
