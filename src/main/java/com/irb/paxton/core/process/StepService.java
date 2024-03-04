package com.irb.paxton.core.process;

import com.irb.paxton.core.model.AbstractRepository;
import com.irb.paxton.core.model.AbstractService;
import com.irb.paxton.core.process.input.StepInput;
import com.irb.paxton.core.process.mapper.StepMapper;
import org.springframework.stereotype.Service;

@Service
public class StepService extends AbstractService<Step> {

    private final StepMapper stepMapper;

    protected StepService(AbstractRepository<Step> repository, StepMapper stepMapper) {
        super(repository);
        this.stepMapper = stepMapper;
    }

    public Step createStep(StepInput stepInput) {
        Step newStep = this.stepMapper.toEntity(stepInput);
        this.create(newStep);
        return newStep;
    }
}
