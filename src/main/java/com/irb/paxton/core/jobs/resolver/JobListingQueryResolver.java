package com.irb.paxton.core.jobs.resolver;

import com.irb.paxton.core.jobs.JobListing;
import com.irb.paxton.core.jobs.JobListingService;
import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SearchRequest;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collection;

@DgsComponent
public class JobListingQueryResolver {

    @Autowired
    private JobListingService jobListingService;

    @DgsQuery
    public PaginatedResponse<JobListing> getAllJobListings(@InputArgument SearchRequest searchQuery) {
        return jobListingService.getAllJobListingsPaginatedFiltered(searchQuery);
    }

    @DgsQuery
    public Collection<JobListing> getRelatedJobListings(@InputArgument String jobName) {
        return jobListingService.findRelatedJobListings(jobName).stream().limit(10).toList();
    }
}
