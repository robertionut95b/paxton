package com.irb.paxton.core.candidate.resolver;

import com.irb.paxton.core.candidate.Application;
import com.irb.paxton.core.candidate.ApplicationService;
import com.irb.paxton.core.candidate.input.ApplicationInput;
import com.irb.paxton.core.messaging.input.MessageInput;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.InputArgument;

@DgsComponent
public class ApplicationMutationResolver {

    private final ApplicationService applicationService;

    public ApplicationMutationResolver(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @DgsMutation
    public Application applyToJobListing(@InputArgument ApplicationInput ApplicationInput) {
        return applicationService.applyToJobListing(ApplicationInput);
    }

    @DgsMutation
    public Application updateApplication(@InputArgument ApplicationInput ApplicationInput) {
        return applicationService.updateApplication(ApplicationInput);
    }

    @DgsMutation
    public Application addMessageToApplicationChat(@InputArgument MessageInput MessageInput, @InputArgument Long applicationId) {
        return applicationService.addMessageToApplicationChat(MessageInput, applicationId);
    }
}
