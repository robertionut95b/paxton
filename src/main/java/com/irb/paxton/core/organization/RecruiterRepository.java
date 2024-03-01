package com.irb.paxton.core.organization;

import com.irb.paxton.core.model.AbstractRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Optional;

@Repository
public interface RecruiterRepository extends AbstractRepository<Recruiter, Long> {

    Optional<Recruiter> findByUser_Username(String username);

    Collection<Recruiter> findByOrganizationId(Long organizationId);

    Collection<Recruiter> findByOrganizationSlugName(String organizationSlug);

    boolean existsByUser_IdAndOrganization_IdNot(Long id, Long id1);
}
