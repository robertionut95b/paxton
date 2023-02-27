package com.irb.paxton.core.jobs.mapper;

import com.irb.paxton.core.jobs.Job;
import com.irb.paxton.core.jobs.input.JobInput;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring")
public abstract class JobMapper {

    public abstract Job toEntity(JobInput jobInput);

    public abstract JobInput toDto(Job job);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    public abstract Job partialUpdate(JobInput jobInput, @MappingTarget Job job);
}