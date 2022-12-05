package com.irb.paxton.core.profile.experience;

import com.irb.paxton.core.activity.ActivitySector;
import com.irb.paxton.core.base.BaseEntity;
import com.irb.paxton.core.jobs.contract.ContractType;
import com.irb.paxton.core.location.City;
import com.irb.paxton.core.organization.Organization;
import com.irb.paxton.core.profile.UserProfile;
import lombok.*;
import org.springframework.lang.Nullable;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_USER_EXPERIENCE")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Experience extends BaseEntity {
    @Setter(AccessLevel.NONE)
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @NotEmpty
    @NotBlank
    private String title;

    @Enumerated
    @Column(nullable = false)
    @NotNull
    private ContractType contractType;

    @ManyToOne
    @JoinColumn(name = "organization_id", referencedColumnName = "id")
    private Organization organization;

    @ManyToOne
    @JoinColumn(name = "city_id")
    private City city;

    @NotNull
    private LocalDate startDate = LocalDate.now();

    @Nullable
    private LocalDate endDate;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "activitySector_id")
    private ActivitySector activitySector;

    @NotNull
    @NotBlank
    @NotEmpty
    @Lob
    private String description;

    @ManyToOne
    @NotNull
    private UserProfile userProfile;
}
