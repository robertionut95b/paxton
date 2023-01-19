package com.irb.paxton.core.process;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ProcessRepository extends JpaRepository<Process, Long>, JpaSpecificationExecutor<Process> {
}
