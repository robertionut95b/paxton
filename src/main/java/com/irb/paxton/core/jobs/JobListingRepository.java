package com.irb.paxton.core.jobs;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Collection;

@Repository
public interface JobListingRepository extends JpaRepository<JobListing, Long>, JpaSpecificationExecutor<JobListing> {

    //    @Query("SELECT e FROM jobListing e where e.availableFrom >= CURRENT_DATE and e.available_to <= CURRENT_DATE ")
    Collection<JobListing> findByJobNameAndAvailableFromLessThanEqualAndAvailableToGreaterThanEqual(String jobName, LocalDate start, LocalDate end);

    boolean existsByRecruiter_Id(Long id);
}
