package com.irb.paxton.core.organization;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Optional;

@Repository
public interface RecruiterRepository extends JpaRepository<Recruiter, Long> {

    Optional<Recruiter> findByUser_Username(String username);

    Collection<Recruiter> findByOrganizationId(Long organizationId);

    Collection<Recruiter> findByOrganizationSlugName(String organizationSlug);
}
