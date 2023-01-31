package com.irb.paxton.core.organization;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.irb.paxton.core.jobs.JobListing;
import com.irb.paxton.core.model.PaxtonEntity;
import com.irb.paxton.core.process.Process;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Collection;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_ORGANIZATION")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Organization extends PaxtonEntity<Long> {

    @NotNull
    @NotBlank
    @NotEmpty
    private String name;

    @NotNull
    @NotBlank
    @NotEmpty
    @Column(length = 2000)
    private String description;

    @NotNull
    @NotBlank
    @NotEmpty
    private String industry;

    @NotEmpty
    @NotNull
    @NotBlank
    private String location;

    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL)
    private Collection<JobListing> jobs;

    private String photography;

    @JsonManagedReference
    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL)
    private Collection<Recruiter> recruiters;

    @ManyToOne
    @JoinColumn(name = "process_id")
    private Process recruitmentProcess;
}
