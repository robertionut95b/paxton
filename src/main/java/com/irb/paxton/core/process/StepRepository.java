package com.irb.paxton.core.process;

import com.irb.paxton.core.model.AbstractRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StepRepository extends AbstractRepository<Step> {

    List<Step> findByProcessSteps_ProcessId(Long id);
}
