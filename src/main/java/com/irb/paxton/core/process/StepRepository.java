package com.irb.paxton.core.process;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StepRepository extends JpaRepository<Step, Long> {
    List<Step> findByProcessSteps_ProcessId(Long id);
}
