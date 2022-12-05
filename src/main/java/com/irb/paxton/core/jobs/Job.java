package com.irb.paxton.core.jobs;

import com.irb.paxton.core.base.BaseEntity;
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

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

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
    @Column(unique = true)
    private String name;

    @NotNull
    @NotBlank
    @NotEmpty
    @Length(min = 10, message = "Description must be longer than 10 characters")
    private String description;

    @OneToMany(mappedBy = "job")
    private Collection<JobListing> jobListings;
}
