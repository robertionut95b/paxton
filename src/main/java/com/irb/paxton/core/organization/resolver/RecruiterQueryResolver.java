package com.irb.paxton.core.organization.resolver;

import com.irb.paxton.core.organization.Recruiter;
import com.irb.paxton.core.organization.RecruiterService;
import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SearchRequest;
import graphql.kickstart.tools.GraphQLQueryResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import java.util.Collection;

@Controller
public class RecruiterQueryResolver implements GraphQLQueryResolver {

    @Autowired
    private RecruiterService recruiterService;

    public Collection<Recruiter> getAllRecruitersForOrganization(Long organizationId) {
        return this.recruiterService.findByOrganizationId(organizationId);
    }

    public Collection<Recruiter> getAllRecruitersForOrganizationBySlug(String organizationSlug) {
        return this.recruiterService.findByOrganizationSlugName(organizationSlug);
    }

    public Recruiter getRecruiterById(Long recruiterId) {
        return this.recruiterService.findById(recruiterId);
    }

    public PaginatedResponse<Recruiter> findRecruitersAdvSearch(SearchRequest searchRequest) {
        return this.recruiterService.findRecruitersAdvSearch(searchRequest);
    }
}
