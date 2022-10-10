package com.irb.paxton.core.jobs.category.resolver;

import com.irb.paxton.core.jobs.category.JobCategory;
import com.irb.paxton.core.jobs.category.JobCategoryRepository;
import graphql.kickstart.tools.GraphQLQueryResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class JobCategoryQueryResolver implements GraphQLQueryResolver {

    @Autowired
    private JobCategoryRepository jobCategoryRepository;

    public List<JobCategory> getAllJobCategories() {
        return this.jobCategoryRepository.findAll();
    }
}
