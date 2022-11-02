package com.irb.paxton.core.jobs;

import com.irb.paxton.core.base.BaseEntity;
import com.irb.paxton.core.candidate.Application;
import com.irb.paxton.core.jobs.category.JobCategory;
import com.irb.paxton.core.jobs.contract.ContractType;
import com.irb.paxton.core.organization.Organization;
import com.irb.paxton.core.process.Process;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.Collection;

import static com.irb.paxton.config.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_JOB_LISTING", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"job_id", "organization_id", "process_id"})
})
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class JobListing extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @NotEmpty
    @NotBlank
    private String title;

    @NotNull
    @NotBlank
    @NotEmpty
    @Length(min = 10, message = "Description must be longer than 10 characters")
    @Lob
    private String description;

    @Column(nullable = false)
    @NotNull
    private LocalDate availableFrom;

    @Column(nullable = false)
    @NotNull
    private LocalDate availableTo;

    @Transient
    @Column(nullable = true)
    private boolean isActive = false;

    @NotNull
    @NotEmpty
    @NotBlank
    private String location;

    @NotNull
    private Integer numberOfVacancies = 1;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "job_id")
    private Job job;

    @Enumerated
    @Column(nullable = false)
    @NotNull
    private ContractType contractType;

    @ManyToOne
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private JobCategory category;

    @OneToMany(mappedBy = "jobListing")
    private Collection<Application> applications;

    @ManyToOne
    @JoinColumn(name = "process_id")
    private Process process;

    public boolean getIsActive() {
        return availableFrom.isAfter(LocalDate.now())
                && availableTo.isBefore(LocalDate.now());
    }
}
