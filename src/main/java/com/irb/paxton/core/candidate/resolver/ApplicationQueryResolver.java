package com.irb.paxton.core.candidate.resolver;

import com.irb.paxton.core.candidate.Application;
import com.irb.paxton.core.candidate.ApplicationService;
import com.irb.paxton.core.candidate.input.ApplicationsCountByStepInput;
import com.irb.paxton.core.candidate.projection.ApplicationsCountByStep;
import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SearchRequest;
import com.irb.paxton.security.SecurityUtils;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import graphql.kickstart.tools.GraphQLQueryResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import java.util.Collection;

@Controller
public class ApplicationQueryResolver implements GraphQLQueryResolver {

    @Autowired
    private ApplicationService applicationService;

    public Application getMyApplicationForJobListing(Long JobListingId) {
        String username = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new UserNotFoundException("User does not exist"));
        return applicationService.findByJobListingIdAndCandidateUsername(JobListingId, username);
    }

    public Application getApplicationById(Long applicationId) {
        return this.applicationService.findByApplicationId(applicationId);
    }

    public Collection<ApplicationsCountByStep> getApplicationsForJobIdCountBySteps(Long jobId) {
        return this.applicationService.getApplicationsForJobIdCountBySteps(jobId);
    }

    public PaginatedResponse<Application> getAllApplications(SearchRequest searchRequest) {
        return this.applicationService.getAllApplications(searchRequest);
    }

    public Collection<Application> getMyApplications(Long userId) {
        return this.applicationService.getApplicationsForUserId(userId);
    }

    public PaginatedResponse<Application> getAllApplicationsByStepTitle(ApplicationsCountByStepInput applicationsCountByStepInput) {
        return this.applicationService.getAllApplicationsByStepTitle(applicationsCountByStepInput);
    }
}
