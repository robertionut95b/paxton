package com.irb.paxton.core.candidate;

import com.irb.paxton.core.base.BaseEntity;
import com.irb.paxton.core.jobs.JobListing;
import com.irb.paxton.core.profile.UserProfile;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.Collection;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_APPLICATION", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"candidate_id", "jobListing_id"})
})
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Application extends BaseEntity {

    @Setter(AccessLevel.NONE)
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "px_application_id_seq")
    @SequenceGenerator(name = "px_application_id_seq", allocationSize = 1)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    private LocalDateTime dateOfApplication = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "application_profile_id")
    private UserProfile applicantProfile;

    @ManyToOne
    @JoinColumn(name = "candidate_id")
    private Candidate candidate;

    @ManyToOne
    @JoinColumn(name = "jobListing_id")
    private JobListing jobListing;

    @OneToMany(mappedBy = "application")
    private Collection<ApplicationDocument> applicationDocuments;
}
