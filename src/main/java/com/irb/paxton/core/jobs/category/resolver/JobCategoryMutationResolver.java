package com.irb.paxton.core.jobs.category.resolver;

import com.irb.paxton.core.jobs.category.JobCategory;
import com.irb.paxton.core.jobs.category.JobCategoryService;
import com.irb.paxton.core.jobs.category.input.JobCategoryInput;
import graphql.kickstart.tools.GraphQLMutationResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class JobCategoryMutationResolver implements GraphQLMutationResolver {

    @Autowired
    private JobCategoryService jobCategoryService;

    public JobCategory addJobCategory(JobCategoryInput jobCategoryInput) {
        return this.jobCategoryService.addJobCategory(jobCategoryInput);
    }
}
