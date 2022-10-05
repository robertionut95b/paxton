package com.irb.paxton.process;

import com.irb.paxton.base.BaseEntity;
import com.irb.paxton.candidate.Candidate;
import com.irb.paxton.jobs.JobListing;
import com.irb.paxton.organization.Recruiter;
import lombok.*;

import javax.persistence.*;

import static com.irb.paxton.config.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_PROCESS_USERS")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProcessUsers extends BaseEntity {
    @Setter(AccessLevel.NONE)
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "process_id")
    private Process process;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Recruiter recruiter;

    @ManyToOne
    @JoinColumn(name = "candidate_id")
    private Candidate candidate;
    
    @ManyToOne
    @JoinColumn(name = "job_listing_id")
    private JobListing jobListing;
}
