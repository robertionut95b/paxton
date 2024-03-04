package com.irb.paxton.core.organization.resolver;

import com.irb.paxton.core.organization.Recruiter;
import com.irb.paxton.core.organization.RecruiterService;
import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SearchRequest;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;

import java.util.Collection;

@DgsComponent
public class RecruiterQueryResolver {

    private final RecruiterService recruiterService;

    public RecruiterQueryResolver(RecruiterService recruiterService) {
        this.recruiterService = recruiterService;
    }

    @DgsQuery
    public Collection<Recruiter> getAllRecruitersForOrganization(@InputArgument Long organizationId) {
        return this.recruiterService.findByOrganizationId(organizationId);
    }

    @DgsQuery
    public Collection<Recruiter> getAllRecruitersForOrganizationBySlug(@InputArgument String organizationSlug) {
        return this.recruiterService.findByOrganizationSlugName(organizationSlug);
    }

    @DgsQuery
    public Recruiter getRecruiterById(@InputArgument Long recruiterId) {
        return this.recruiterService.findById(recruiterId);
    }

    @DgsQuery
    public PaginatedResponse<Recruiter> findRecruitersAdvSearch(@InputArgument SearchRequest searchQuery) {
        return this.recruiterService.findRecruitersAdvSearch(searchQuery);
    }
}
