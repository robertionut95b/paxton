package com.irb.paxton.core.study.input;

import com.irb.paxton.core.study.certification.input.CertificationInput;
import com.irb.paxton.core.study.domain.input.DomainInput;
import com.irb.paxton.core.study.institution.input.InstitutionInput;
import lombok.Data;
import org.springframework.lang.Nullable;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.LocalDate;

@Data
public class StudyInputCreate implements Serializable {

    @NotNull
    public InstitutionInput institution;
    public DomainInput domainStudy;
    public CertificationInput certification;
    private Long id;
    private String degree;
    private String description;

    @NotNull
    private LocalDate startDate = LocalDate.now();

    @Nullable
    private LocalDate endDate;

    @NotNull
    private String userProfileSlugUrl;
}
