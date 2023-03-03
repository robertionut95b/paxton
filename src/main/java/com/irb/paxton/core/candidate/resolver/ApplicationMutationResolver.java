package com.irb.paxton.core.candidate.resolver;

import com.irb.paxton.core.candidate.Application;
import com.irb.paxton.core.candidate.ApplicationService;
import com.irb.paxton.core.candidate.input.ApplicationInput;
import graphql.kickstart.tools.GraphQLMutationResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class ApplicationMutationResolver implements GraphQLMutationResolver {

    @Autowired
    ApplicationService applicationService;

    Application applyToJobListing(ApplicationInput applicationInput) {
        return applicationService.applyToJobListing(applicationInput);
    }

    Application updateApplication(ApplicationInput applicationInput) {
        return applicationService.updateApplication(applicationInput);
    }
}
