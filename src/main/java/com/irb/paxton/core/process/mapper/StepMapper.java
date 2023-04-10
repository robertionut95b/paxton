package com.irb.paxton.core.process.mapper;

import com.irb.paxton.core.model.mapper.ReferenceMapper;
import com.irb.paxton.core.process.Step;
import com.irb.paxton.core.process.input.StepInput;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING,
        uses = {ReferenceMapper.class})
public interface StepMapper {

    Step toEntity(StepInput stepInput);

    StepInput toDto(Step step);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Step partialUpdate(StepInput stepInput, @MappingTarget Step step);
}