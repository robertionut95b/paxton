package com.irb.paxton.core.jobs;

import com.irb.paxton.core.base.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

import static com.irb.paxton.config.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_JOB_LISTING")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class JobListing extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(nullable = false)
    @NotNull
    private LocalDateTime availableFrom;

    @Column(nullable = false)
    @NotNull
    private LocalDateTime availableTo;

    @Transient
    private boolean isActive;

    @NotNull
    @NotEmpty
    @NotBlank
    private String location;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "job_id")
    private Job job;

    public boolean getIsActive() {
        return availableFrom.isAfter(LocalDateTime.now())
                && availableTo.isBefore(LocalDateTime.now());
    }
}
