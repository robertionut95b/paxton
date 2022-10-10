package com.irb.paxton.core.jobs.resolver;

import com.irb.paxton.core.jobs.JobService;
import com.irb.paxton.core.jobs.Job;
import com.irb.paxton.core.jobs.input.JobInput;
import com.irb.paxton.core.organization.OrganizationRepository;
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
