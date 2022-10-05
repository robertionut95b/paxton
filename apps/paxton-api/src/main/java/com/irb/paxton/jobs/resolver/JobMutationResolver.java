package com.irb.paxton.jobs.resolver;

import com.irb.paxton.jobs.Job;
import com.irb.paxton.jobs.JobService;
import com.irb.paxton.jobs.input.JobInput;
import com.irb.paxton.organization.OrganizationRepository;
import graphql.kickstart.tools.GraphQLMutationResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;

@Controller
@Validated
@RequiredArgsConstructor
public class JobMutationResolver implements GraphQLMutationResolver {

    @Autowired
    private JobService jobService;

    @Autowired
    private OrganizationRepository organizationRepository;

    public Job publishJobDescription(@Valid JobInput jobInput) {
        return jobService.publishJobDescription(jobInput);
    }
}
