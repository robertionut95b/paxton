package com.irb.paxton.jobs;

import com.irb.paxton.base.BaseEntity;
import com.irb.paxton.jobs.category.JobCategory;
import com.irb.paxton.jobs.contract.ContractType;
import com.irb.paxton.organization.Organization;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Collection;

import static com.irb.paxton.config.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_JOB")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Job extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @NotBlank(message = "Name cannot be blank")
    @NotEmpty
    private String name;

    @NotNull
    @NotBlank
    @NotEmpty
    @Length(min = 10, message = "Description must be longer than 10 characters")
    private String description;

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

    @OneToMany(mappedBy = "job")
    private Collection<JobListing> jobListings;
}
