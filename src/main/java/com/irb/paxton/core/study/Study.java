package com.irb.paxton.core.study;

import com.irb.paxton.core.base.BaseEntity;
import com.irb.paxton.core.profile.UserProfile;
import com.irb.paxton.core.study.certification.Certification;
import com.irb.paxton.core.study.domain.Domain;
import com.irb.paxton.core.study.institution.Institution;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import static com.irb.paxton.config.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_STUDY")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Study extends BaseEntity {
    @Setter(AccessLevel.NONE)
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

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

    @ManyToOne
    @JoinColumn(name = "user_profile_id")
    @NotNull
    private UserProfile userProfile;
}