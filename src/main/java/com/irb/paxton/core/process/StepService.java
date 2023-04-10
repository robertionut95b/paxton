package com.irb.paxton.core.process;

import com.irb.paxton.core.model.AbstractRepository;
import com.irb.paxton.core.model.AbstractService;
import com.irb.paxton.core.process.input.StepInput;
import com.irb.paxton.core.process.mapper.StepMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StepService extends AbstractService<Step, Long> {

    @Autowired
    private StepRepository stepRepository;

    @Autowired
    private StepMapper stepMapper;

    protected StepService(AbstractRepository<Step, Long> repository) {
        super(repository);
    }

    public Step createStep(StepInput stepInput) {
        Step newStep = this.stepMapper.toEntity(stepInput);
        stepRepository.save(newStep);
        return newStep;
    }
}
