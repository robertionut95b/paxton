package com.irb.paxton.core.jobs;

import com.irb.paxton.core.model.PaxtonEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

import java.util.Collection;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_JOB")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Job extends PaxtonEntity {

    @NotNull
    @NotBlank
    @NotEmpty
    @Column(unique = true)
    @Length(min = 3, max = 25, message = "Name must be between {min} and {max} characters")
    private String name;

    @NotNull
    @NotBlank
    @NotEmpty
    @Length(min = 10, max = 250, message = "Description must be between {min} and {max} characters")
    private String description;

    @OneToMany(mappedBy = "job", cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    private Collection<JobListing> jobListings;
}
