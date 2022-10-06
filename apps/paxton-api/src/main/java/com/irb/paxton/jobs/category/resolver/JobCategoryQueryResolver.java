package com.irb.paxton.jobs.category.resolver;

import com.irb.paxton.jobs.category.JobCategory;
import com.irb.paxton.jobs.category.JobCategoryRepository;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@DgsComponent
public class JobCategoryQueryResolver {

    @Autowired
    private JobCategoryRepository jobCategoryRepository;

    @DgsQuery
    public List<JobCategory> getAllJobCategories() {
        return this.jobCategoryRepository.findAll();
    }
}
