package com.irb.paxton.core.candidate;

import com.irb.paxton.core.candidate.projection.ApplicationsCountByStep;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long>, JpaSpecificationExecutor<Application> {
    @Query(value = """
            SELECT new com.irb.paxton.core.candidate.projection.ApplicationsCountByStep(count(s.title) AS applicationsCount, s.title AS stepTitle) FROM Application ap
            JOIN ap.processSteps aps on aps.registeredAt = (SELECT max(a.registeredAt) FROM ApplicationProcessSteps a WHERE aps.application.id = a.application.id)
            JOIN aps.processStep ps on ps.order = (SELECT max(b.order) FROM ProcessSteps b where ps.id = b.id)
            JOIN ps.step s
            WHERE ap.jobListing.id = :jobId
            GROUP BY s.title
            """)
    Collection<ApplicationsCountByStep> getApplicationsForJobIdCountBySteps(@Param("jobId") Long jobId);

    Collection<Application> findByCandidate_User_Id(Long id);

    Optional<Application> findByJobListingIdAndCandidate_UserUsername(Long jobListingId, String username);


}
