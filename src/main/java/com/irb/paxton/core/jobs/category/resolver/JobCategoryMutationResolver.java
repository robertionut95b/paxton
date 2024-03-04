package com.irb.paxton.core.jobs.category.resolver;

import com.irb.paxton.core.jobs.category.JobCategory;
import com.irb.paxton.core.jobs.category.JobCategoryService;
import com.irb.paxton.core.jobs.category.input.JobCategoryInput;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.InputArgument;

@DgsComponent
public class JobCategoryMutationResolver {

    private final JobCategoryService jobCategoryService;

    public JobCategoryMutationResolver(JobCategoryService jobCategoryService) {
        this.jobCategoryService = jobCategoryService;
    }

    @DgsMutation
    public JobCategory addJobCategory(@InputArgument JobCategoryInput JobCategoryInput) {
        return this.jobCategoryService.addJobCategory(JobCategoryInput);
    }
}
