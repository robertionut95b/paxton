package com.irb.paxton.core.jobs.mapper;

import com.irb.paxton.core.jobs.Job;
import com.irb.paxton.core.jobs.input.JobInput;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring")
public interface JobMapper {

    Job toEntity(JobInput jobInput);

    JobInput toDto(Job job);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Job partialUpdate(JobInput jobInput, @MappingTarget Job job);
}