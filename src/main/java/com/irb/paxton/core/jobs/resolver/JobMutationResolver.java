package com.irb.paxton.core.jobs.resolver;

import com.irb.paxton.core.jobs.Job;
import com.irb.paxton.core.jobs.JobService;
import com.irb.paxton.core.jobs.input.JobInput;
import com.irb.paxton.core.organization.OrganizationRepository;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.InputArgument;
import org.springframework.beans.factory.annotation.Autowired;

@DgsComponent
public class JobMutationResolver {

    @Autowired
    private JobService jobService;

    @Autowired
    private OrganizationRepository organizationRepository;

    @DgsMutation
    public Job publishJob(@InputArgument JobInput JobInput) {
        return jobService.publishJob(JobInput);
    }
}
