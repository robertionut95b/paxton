package com.irb.paxton.core.jobs.category;

import com.irb.paxton.core.base.BaseEntity;
import com.irb.paxton.core.jobs.Job;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Collection;

import static com.irb.paxton.config.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_JOB_CATEGORY")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class JobCategory extends BaseEntity {
    @Setter(AccessLevel.NONE)
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @NotEmpty
    @NotBlank
    private String name;

    @OneToMany(mappedBy = "category")
    private Collection<Job> jobs;
}
