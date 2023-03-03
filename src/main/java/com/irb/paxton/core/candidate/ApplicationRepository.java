package com.irb.paxton.core.candidate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long>, JpaSpecificationExecutor<Application> {
    Optional<Application> findByJobListing_Id(Long id);

    Collection<Application> findByCandidate_User_Id(Long id);

    Optional<Application> findByJobListingIdAndCandidate_UserUsername(Long jobListingId, String username);
}
