package com.irb.paxton.core.candidate;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.irb.paxton.core.candidate.documents.ApplicationDocument;
import com.irb.paxton.core.candidate.listener.ApplicationListener;
import com.irb.paxton.core.candidate.validator.OrderedProcessSteps;
import com.irb.paxton.core.candidate.validator.ValidOrganizationProcessSteps;
import com.irb.paxton.core.jobs.JobListing;
import com.irb.paxton.core.messaging.Chat;
import com.irb.paxton.core.model.PaxtonEntity;
import com.irb.paxton.core.process.ProcessSteps;
import com.irb.paxton.core.profile.UserProfile;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serial;
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
@EntityListeners(value = {ApplicationListener.class})
public class Application extends PaxtonEntity<Long> {

    @Serial
    private static final long serialVersionUID = -9186763748718953611L;

    @NotNull
    private OffsetDateTime dateOfApplication = OffsetDateTime.now();

    @JsonBackReference(value = "application_profile_id")
    @ManyToOne
    @JoinColumn(name = "application_profile_id")
    private UserProfile applicantProfile;

    @JsonBackReference(value = "candidate_id")
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "candidate_id")
    private Candidate candidate;

    @ManyToOne
    @JsonBackReference(value = "jobListing_id")
    @JoinColumn(name = "jobListing_id")
    private JobListing jobListing;

    @NotNull
    private ApplicationStatus status = ApplicationStatus.IN_PROGRESS;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "current_step_id")
    @JsonBackReference(value = "current_step_id")
    private ProcessSteps currentStep;

    @JsonManagedReference(value = "applicationDocuments")
    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    private Collection<ApplicationDocument> applicationDocuments;

    @ValidOrganizationProcessSteps
    @OrderedProcessSteps
    @JsonManagedReference(value = "applicationProcessSteps")
    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    private Collection<ApplicationProcessSteps> processSteps;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "chat_id")
    @NotNull
    private Chat chat;

    public Application addApplicationDocument(ApplicationDocument applicationDocument) {
        if (!this.applicationDocuments.contains(applicationDocument)) {
            this.applicationDocuments.add(applicationDocument);
        }
        return this;
    }

    public Application removeApplicationDocument(ApplicationDocument applicationDocument) {
        this.applicationDocuments.remove(applicationDocument);
        applicationDocument.setDocument(null);
        return this;
    }

    public Application removeAllProcessSteps() {
        this.processSteps.clear();
        return this;
    }

    public Application addProcessSteps(ApplicationProcessSteps aps) {
        if (!this.processSteps.contains(aps)) {
            this.processSteps.add(aps);
        }
        return this;
    }
}
