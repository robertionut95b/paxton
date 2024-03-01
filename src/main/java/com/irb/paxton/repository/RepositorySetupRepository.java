package com.irb.paxton.repository;

import com.irb.paxton.core.model.AbstractRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepositorySetupRepository extends AbstractRepository<RepositorySetup, Long> {

    RepositorySetup findByIsActive(boolean active);
}
