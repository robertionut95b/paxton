package com.irb.paxton.core.jobs.resolver;

import com.irb.paxton.core.jobs.JobListing;
import com.irb.paxton.core.jobs.JobListingService;
import com.irb.paxton.core.jobs.input.JobListingInput;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.InputArgument;

@DgsComponent
public class JobListingMutationResolver {

    private final JobListingService jobListingService;

    public JobListingMutationResolver(JobListingService jobListingService) {
        this.jobListingService = jobListingService;
    }

    @DgsMutation
    public JobListing publishJobListing(@InputArgument JobListingInput JobListingInput) {
        return this.jobListingService.publishJobListing(JobListingInput);
    }
}
