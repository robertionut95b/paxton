package com.irb.paxton.core.study;

import com.irb.paxton.core.base.BaseEntity;
import com.irb.paxton.core.profile.UserProfile;
import lombok.*;
import com.irb.paxton.core.study.domains.Domain;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

import static com.irb.paxton.config.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_PROFILE_STUDIES")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProfileStudies extends BaseEntity {

    @Setter(AccessLevel.NONE)
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "study_id")
    private Study study;

    @ManyToOne
    @JoinColumn(name = "profile_id")
    private UserProfile profile;

    @NotNull
    private LocalDate startDate;

    private LocalDate endDate;

    private String diploma;

    private String description;

    private Domain domain;

}
