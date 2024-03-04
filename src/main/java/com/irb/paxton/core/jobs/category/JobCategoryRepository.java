package com.irb.paxton.core.jobs.category;

import com.irb.paxton.core.model.AbstractRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobCategoryRepository extends AbstractRepository<JobCategory> {
    Optional<JobCategory> findByName(String name);
}
