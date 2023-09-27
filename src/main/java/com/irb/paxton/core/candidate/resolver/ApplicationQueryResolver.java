package com.irb.paxton.core.candidate.resolver;

import com.irb.paxton.core.candidate.Application;
import com.irb.paxton.core.candidate.ApplicationService;
import com.irb.paxton.core.candidate.projection.ApplicationsCountByStep;
import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SearchRequest;
import com.irb.paxton.security.SecurityUtils;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collection;

@DgsComponent
public class ApplicationQueryResolver {

    @Autowired
    private ApplicationService applicationService;

    @DgsQuery
    public Application getMyApplicationForJobListing(@InputArgument Long JobListingId) {
        String username = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new UserNotFoundException("User does not exist"));
        return applicationService.findByJobListingIdAndCandidateUsername(JobListingId, username);
    }

    @DgsQuery
    public Application getApplicationById(@InputArgument Long applicationId) {
        return this.applicationService.findByApplicationId(applicationId);
    }

    @DgsQuery
    public Collection<ApplicationsCountByStep> getApplicationsForJobIdCountBySteps(@InputArgument Long jobId) {
        return this.applicationService.getApplicationsForJobIdCountBySteps(jobId);
    }

    @DgsQuery
    public PaginatedResponse<Application> getAllApplications(@InputArgument SearchRequest searchQuery) {
        return this.applicationService.getAllApplications(searchQuery);
    }

    @DgsQuery
    public Collection<Application> getMyApplications(@InputArgument Long userId) {
        return this.applicationService.getApplicationsForUserId(userId);
    }
}
