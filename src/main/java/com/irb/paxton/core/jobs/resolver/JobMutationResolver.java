package com.irb.paxton.core.jobs.resolver;

import com.irb.paxton.core.jobs.Job;
import com.irb.paxton.core.jobs.JobService;
import com.irb.paxton.core.jobs.input.JobInput;
import com.irb.paxton.core.organization.OrganizationRepository;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.InputArgument;
import jakarta.validation.Valid;

@DgsComponent
public class JobMutationResolver {

    private final JobService jobService;

    private final OrganizationRepository organizationRepository;

    public JobMutationResolver(JobService jobService, OrganizationRepository organizationRepository) {
        this.jobService = jobService;
        this.organizationRepository = organizationRepository;
    }

    @DgsMutation
    public Job publishJob(@InputArgument @Valid JobInput JobInput) {
        return jobService.publishJob(JobInput);
    }
}
