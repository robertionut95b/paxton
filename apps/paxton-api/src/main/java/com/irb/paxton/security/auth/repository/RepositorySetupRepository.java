package com.irb.paxton.security.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepositorySetupRepository extends JpaRepository<RepositorySetup, Long> {

    RepositorySetup findByIsActive(boolean active);
}
