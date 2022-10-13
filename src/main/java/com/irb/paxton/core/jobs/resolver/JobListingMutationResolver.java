package com.irb.paxton.core.jobs.resolver;

import com.irb.paxton.core.jobs.JobListing;
import com.irb.paxton.core.jobs.JobListingService;
import com.irb.paxton.core.jobs.input.JobListingInput;
import graphql.kickstart.tools.GraphQLMutationResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;

@Controller
@Validated
@RequiredArgsConstructor
public class JobListingMutationResolver implements GraphQLMutationResolver {

    @Autowired
    private JobListingService jobListingService;

    public JobListing publishJobListing(@Valid JobListingInput JobListingInput) {
        return this.jobListingService.publishJobListing(JobListingInput);
    }
}
