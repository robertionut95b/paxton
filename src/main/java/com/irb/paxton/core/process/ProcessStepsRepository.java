package com.irb.paxton.core.process;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProcessStepsRepository extends JpaRepository<ProcessSteps, Long> {

}