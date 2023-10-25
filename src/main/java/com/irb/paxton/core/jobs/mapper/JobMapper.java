package com.irb.paxton.core.jobs.mapper;

import com.irb.paxton.core.jobs.Job;
import com.irb.paxton.core.jobs.input.JobInput;
import com.irb.paxton.core.model.mapper.ReferenceMapper;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring", injectionStrategy = InjectionStrategy.CONSTRUCTOR, uses = {ReferenceMapper.class})
public interface JobMapper {

    Job toEntity(JobInput jobInput);

    JobInput toDto(Job job);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Job partialUpdate(JobInput jobInput, @MappingTarget Job job);
}