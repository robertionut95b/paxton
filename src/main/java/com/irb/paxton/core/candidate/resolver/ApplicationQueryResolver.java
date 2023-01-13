package com.irb.paxton.core.candidate.resolver;

import com.irb.paxton.core.candidate.Application;
import com.irb.paxton.core.candidate.ApplicationRepository;
import com.irb.paxton.core.candidate.ApplicationService;
import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SearchRequest;
import com.irb.paxton.security.SecurityUtils;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import graphql.kickstart.tools.GraphQLQueryResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class ApplicationQueryResolver implements GraphQLQueryResolver {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private ApplicationService applicationService;

    public Application getMyApplicationForJobListing(Long JobListingId) {
        String username = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new UserNotFoundException("User does not exist"));
        return applicationRepository.findByJobListingIdAndCandidate_UserUsername(JobListingId, username);
    }

    public PaginatedResponse<Application> getAllApplications(SearchRequest searchRequest) {
        return this.applicationService.getAllApplicationsByJobListingId(searchRequest);
    }
}
