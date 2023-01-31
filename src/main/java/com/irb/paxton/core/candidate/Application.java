package com.irb.paxton.core.candidate;

import com.irb.paxton.core.jobs.JobListing;
import com.irb.paxton.core.model.PaxtonEntity;
import com.irb.paxton.core.profile.UserProfile;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.OffsetDateTime;
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
public class Application extends PaxtonEntity<Long> {

    @NotNull
    private OffsetDateTime dateOfApplication = OffsetDateTime.now();

    @ManyToOne
    @JoinColumn(name = "application_profile_id")
    private UserProfile applicantProfile;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "candidate_id")
    private Candidate candidate;

    @ManyToOne
    @JoinColumn(name = "jobListing_id")
    private JobListing jobListing;

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL)
    private Collection<ApplicationDocument> applicationDocuments;

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL)
    private Collection<ApplicationProcessSteps> processSteps;
}
