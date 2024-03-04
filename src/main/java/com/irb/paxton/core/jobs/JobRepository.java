package com.irb.paxton.core.jobs;

import com.irb.paxton.core.model.AbstractRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobRepository extends AbstractRepository<Job> {

    Optional<Job> findByName(String name);
}
