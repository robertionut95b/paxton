package com.irb.paxton.core.organization;

import com.irb.paxton.core.base.BaseEntity;
import com.irb.paxton.core.jobs.JobListing;
import lombok.*;
import org.springframework.lang.Nullable;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Collection;

import static com.irb.paxton.config.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_ORGANIZATION")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Organization extends BaseEntity {
    @Setter(AccessLevel.NONE)
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @NotBlank
    @NotEmpty
    private String name;

    @NotNull
    @NotBlank
    @NotEmpty
    private String industry;

    @NotEmpty
    @NotNull
    @NotBlank
    private String location;

    @OneToMany(mappedBy = "organization")
    private Collection<JobListing> jobs;

    @Nullable
    private String photography;
}
