package com.irb.paxton.jobs.resolver;

import com.irb.paxton.jobs.Job;
import com.irb.paxton.jobs.JobService;
import com.irb.paxton.jobs.input.JobInput;
import com.irb.paxton.organization.OrganizationRepository;
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
    public Job publishJobDescription(@InputArgument JobInput JobInput) {
        return jobService.publishJobDescription(JobInput);
    }
}
