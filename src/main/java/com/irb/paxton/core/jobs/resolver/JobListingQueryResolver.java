package com.irb.paxton.core.jobs.resolver;

import com.irb.paxton.core.jobs.JobListing;
import com.irb.paxton.core.jobs.JobListingService;
import graphql.kickstart.tools.GraphQLQueryResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class JobListingQueryResolver implements GraphQLQueryResolver {

    @Autowired
    private JobListingService jobListingService;

    public List<JobListing> getAllJobListings() {
        return jobListingService.getAllJobListings();
    }
}
