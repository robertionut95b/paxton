package com.irb.paxton.core.jobs.category.mapper;

import com.irb.paxton.core.jobs.category.JobCategory;
import com.irb.paxton.core.jobs.category.input.JobCategoryInput;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring")
public interface JobCategoryMapper {

    JobCategory inputToJobCategory(JobCategoryInput jobCategoryInput);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    JobCategory partialUpdate(JobCategoryInput jobCategoryInput, @MappingTarget JobCategory jobCategory);
}
