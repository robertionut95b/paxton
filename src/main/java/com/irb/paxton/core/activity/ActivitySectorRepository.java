package com.irb.paxton.core.activity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivitySectorRepository extends JpaRepository<ActivitySector, Long> {
}
