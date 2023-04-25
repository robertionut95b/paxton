package com.irb.paxton.core.jobs;

import com.irb.paxton.core.candidate.Application;
import com.irb.paxton.core.jobs.category.JobCategory;
import com.irb.paxton.core.jobs.contract.ContractType;
import com.irb.paxton.core.jobs.worktype.WorkType;
import com.irb.paxton.core.location.City;
import com.irb.paxton.core.model.PaxtonEntity;
import com.irb.paxton.core.organization.Organization;
import com.irb.paxton.core.organization.Recruiter;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_JOB_LISTING")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class JobListing extends PaxtonEntity<Long> {

    @Column(nullable = false)
    @NotNull
    @NotEmpty
    @NotBlank
    private String title;

    @NotNull
    @NotBlank
    @NotEmpty
    @Length(min = 10, message = "Description must be longer than 10 characters")
    @Lob
    @Column(nullable = false)
    private String description;

    @NotNull
    @NotBlank
    @NotEmpty
    @Length(min = 10, message = "Description must be longer than 10 characters")
    @Lob
    @Column(nullable = false)
    private String formattedDescription;

    @FutureOrPresent
    @Column(nullable = false)
    @NotNull
    private LocalDate availableFrom;

    @FutureOrPresent
    @Column(nullable = false)
    @NotNull
    private LocalDate availableTo;

    @Transient
    private boolean isActive;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "city_id")
    private City city;

    @Positive
    @Min(1)
    @NotNull
    private Integer numberOfVacancies = 1;

    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull
    private ContractType contractType;

    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private JobCategory category;

    @OneToMany(mappedBy = "jobListing")
    private Collection<Application> applications;

    @ManyToOne
    @JoinColumn(name = "recruiter_id")
    private Recruiter recruiter;

    @Enumerated(EnumType.STRING)
    @NotNull
    private WorkType workType = WorkType.HYBRID;

    @PostLoad
    private void postLoad() {
        this.isActive = LocalDateTime.now().isAfter(availableFrom.atStartOfDay())
                && LocalDateTime.now().isBefore(availableTo.atStartOfDay());
    }
}
