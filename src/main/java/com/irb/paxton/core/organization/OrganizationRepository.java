package com.irb.paxton.core.organization;

import com.irb.paxton.core.model.AbstractRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrganizationRepository extends AbstractRepository<Organization, Long> {

    Optional<Organization> findBySlugName(String name);
}
