package com.irb.paxton.profile.experience;

import com.irb.paxton.activity.ActivitySector;
import com.irb.paxton.base.BaseEntity;
import com.irb.paxton.jobs.contract.ContractType;
import com.irb.paxton.organization.Organization;
import lombok.*;
import org.springframework.lang.Nullable;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

import static com.irb.paxton.config.ApplicationProperties.TABLE_PREFIX;

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

    private String location;

    @NotNull
    private LocalDate startDate = LocalDate.now();

    @Nullable
    private LocalDate endDate;

    @NotNull
    @NotEmpty
    @NotBlank
    @ManyToOne
    @JoinColumn(name = "activitySector_id")
    private ActivitySector activitySector;

    @NotNull
    @NotBlank
    @NotEmpty
    private String description;
}
