package com.irb.paxton.core.process;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProcessRepository extends JpaRepository<Process, Long>, JpaSpecificationExecutor<Process> {

    Optional<Process> findByName(String name);
}
