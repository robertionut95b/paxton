package com.irb.paxton.core.process;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StepRepository extends JpaRepository<Step, Long> {
}
