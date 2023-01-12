package com.irb.paxton.core.candidate.resolver;

import com.irb.paxton.core.candidate.Application;
import com.irb.paxton.core.candidate.ApplicationRepository;
import graphql.kickstart.tools.GraphQLQueryResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class ApplicationQueryResolver implements GraphQLQueryResolver {

    @Autowired
    private ApplicationRepository applicationRepository;

    public Application getApplicationForJobListing(Long JobListingId) {
        return applicationRepository.findByJobListingId(JobListingId);
    }
}
