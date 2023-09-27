package com.irb.paxton.core.jobs.category;

import com.irb.paxton.core.jobs.JobListing;
import com.irb.paxton.core.model.PaxtonEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.Collection;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_JOB_CATEGORY")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class JobCategory extends PaxtonEntity<Long> {

    @NotNull
    @NotEmpty
    @NotBlank
    @Column(unique = true)
    private String name;

    @OneToMany(mappedBy = "category", cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    private Collection<JobListing> jobs;
}
