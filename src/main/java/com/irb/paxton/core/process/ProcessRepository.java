package com.irb.paxton.core.process;

import com.irb.paxton.core.model.AbstractRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProcessRepository extends AbstractRepository<Process, Long> {

    Optional<Process> findByName(String name);
}
