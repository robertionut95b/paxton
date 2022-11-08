package com.irb.paxton.core.process;

import com.irb.paxton.core.base.BaseEntity;
import com.irb.paxton.core.jobs.JobListing;
import com.irb.paxton.core.organization.Recruiter;
import lombok.*;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Collection;

import static com.irb.paxton.config.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_PROCESS")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Process extends BaseEntity {
    @Setter(AccessLevel.NONE)
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @NotEmpty
    @NotBlank
    @Length(min = 5)
    private String name;

    @NotNull
    @NotEmpty
    @NotBlank
    @Length(min = 10)
    private String description;

    @OneToMany(mappedBy = "process")
    private Collection<ProcessSteps> processSteps;

    @ManyToOne
    @JoinColumn(name = "recruiter_id")
    private Recruiter recruiter;

    @OneToMany(mappedBy = "process", cascade = CascadeType.ALL)
    private Collection<JobListing> jobListings;
}
