package com.irb.paxton.core.jobs;

import com.irb.paxton.core.model.AbstractRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Collection;

@Repository
public interface JobListingRepository extends AbstractRepository<JobListing, Long> {

    //    @Query("SELECT e FROM jobListing e where e.availableFrom >= CURRENT_DATE and e.available_to <= CURRENT_DATE ")
    Collection<JobListing> findByJobNameAndAvailableFromLessThanEqualAndAvailableToGreaterThanEqual(String jobName, LocalDate start, LocalDate end);

}
