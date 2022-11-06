package com.irb.paxton.core.jobs.resolver;

import com.irb.paxton.core.jobs.JobListing;
import com.irb.paxton.core.jobs.JobListingService;
import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SearchRequest;
import graphql.kickstart.tools.GraphQLQueryResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;

@Controller
@Validated
public class JobListingQueryResolver implements GraphQLQueryResolver {

    @Autowired
    private JobListingService jobListingService;

    public PaginatedResponse<JobListing> getAllJobListings(@Valid SearchRequest searchRequest) {
        return jobListingService.getAllJobListingsPaginatedFiltered(searchRequest);
    }
}
