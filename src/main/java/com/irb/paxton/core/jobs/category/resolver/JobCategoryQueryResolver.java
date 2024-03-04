package com.irb.paxton.core.jobs.category.resolver;

import com.irb.paxton.core.jobs.category.JobCategory;
import com.irb.paxton.core.jobs.category.JobCategoryRepository;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;

import java.util.List;

@DgsComponent
public class JobCategoryQueryResolver {

    private final JobCategoryRepository jobCategoryRepository;

    public JobCategoryQueryResolver(JobCategoryRepository jobCategoryRepository) {
        this.jobCategoryRepository = jobCategoryRepository;
    }

    @DgsQuery
    public List<JobCategory> getAllJobCategories() {
        return this.jobCategoryRepository.findAll();
    }
}
