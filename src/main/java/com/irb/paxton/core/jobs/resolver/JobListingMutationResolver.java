package com.irb.paxton.core.jobs.resolver;

import com.irb.paxton.core.jobs.JobListing;
import com.irb.paxton.core.jobs.JobListingService;
import com.irb.paxton.core.jobs.input.JobListingInput;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.InputArgument;
import org.springframework.beans.factory.annotation.Autowired;

@DgsComponent
public class JobListingMutationResolver {

    @Autowired
    private JobListingService jobListingService;

    @DgsMutation
    public JobListing publishJobListing(@InputArgument JobListingInput JobListingInput) {
        return this.jobListingService.publishJobListing(JobListingInput);
    }
}
