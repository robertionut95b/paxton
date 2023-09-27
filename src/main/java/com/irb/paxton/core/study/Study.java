package com.irb.paxton.core.study;

import com.irb.paxton.core.model.PaxtonEntity;
import com.irb.paxton.core.profile.UserProfile;
import com.irb.paxton.core.study.certification.Certification;
import com.irb.paxton.core.study.domain.Domain;
import com.irb.paxton.core.study.institution.Institution;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.lang.Nullable;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_STUDY")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Study extends PaxtonEntity<Long> {

    @ManyToOne
    @JoinColumn(name = "institution_id")
    @NotNull
    private Institution institution;

    @ManyToOne
    @JoinColumn(name = "domain_study_id")
    private Domain domainStudy;

    private String degree;

    @ManyToOne
    @JoinColumn(name = "certification_id")
    private Certification certification;

    @Column(length = 1000)
    private String description;

    @NotNull
    private LocalDate startDate = LocalDate.now();

    @Nullable
    private LocalDate endDate;

    @ManyToOne
    @JoinColumn(name = "user_profile_id")
    @NotNull
    private UserProfile userProfile;
}