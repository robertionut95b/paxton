package com.irb.paxton.core.study.input;

import com.irb.paxton.core.study.certification.input.CertificationInput;
import com.irb.paxton.core.study.domain.input.DomainInput;
import com.irb.paxton.core.study.institution.input.InstitutionInput;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class StudyInputCreate {

    private Long id;

    @NotNull
    private InstitutionInput institution;

    private DomainInput domainStudy;

    private String degree;

    private CertificationInput certification;

    private String description;

    @NotNull
    private String userProfileSlugUrl;
}
