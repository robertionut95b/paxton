package com.irb.paxton.core.organization.resolver;

import com.irb.paxton.core.organization.Recruiter;
import com.irb.paxton.core.organization.RecruiterService;
import com.irb.paxton.core.organization.input.RecruiterInput;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.InputArgument;

import java.util.Collection;
import java.util.List;

@DgsComponent
public class RecruiterMutationResolver {

    private final RecruiterService recruiterService;

    public RecruiterMutationResolver(RecruiterService recruiterService) {
        this.recruiterService = recruiterService;
    }

    @DgsMutation
    public Collection<Recruiter> alterRecruitersInOrganization(@InputArgument List<RecruiterInput> RecruiterInput, @InputArgument Long OrganizationId) {
        return recruiterService.alterRecruitersInOrganization(RecruiterInput, OrganizationId);
    }
}
