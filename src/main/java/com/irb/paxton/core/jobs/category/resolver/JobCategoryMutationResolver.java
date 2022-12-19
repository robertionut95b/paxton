package com.irb.paxton.core.jobs.category.resolver;

import com.irb.paxton.core.jobs.category.JobCategory;
import com.irb.paxton.core.jobs.category.JobCategoryRepository;
import com.irb.paxton.core.jobs.category.input.JobCategoryInput;
import com.irb.paxton.core.jobs.category.mapper.JobCategoryMapper;
import graphql.kickstart.tools.GraphQLMutationResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class JobCategoryMutationResolver implements GraphQLMutationResolver {

    @Autowired
    private JobCategoryRepository jobCategoryRepository;

    @Autowired
    private JobCategoryMapper jobCategoryMapper;

    public JobCategory addJobCategory(JobCategoryInput jobCategoryInput) {
        return this.jobCategoryRepository.save(jobCategoryMapper.inputToJobCategory(jobCategoryInput));
    }
}
