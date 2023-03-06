package com.irb.paxton.core.candidate;

import com.irb.paxton.core.candidate.exception.ApplicationNotFoundException;
import com.irb.paxton.core.candidate.input.ApplicationInput;
import com.irb.paxton.core.candidate.mapper.ApplicationMapper;
import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SearchRequest;
import com.irb.paxton.core.search.SearchSpecification;
import com.irb.paxton.security.auth.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PostFilter;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
public class ApplicationService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    private ApplicationRepository applicationRepository;
    @Autowired
    private ApplicationMapper applicationMapper;

    @PreAuthorize("!hasRole('ROLE_RECRUITER') or !hasRole('ROLE_ADMINISTRATOR')")
    public Application applyToJobListing(ApplicationInput applicationInput) {
        Application application = applicationMapper.inputToApplication(applicationInput);
        application.getProcessSteps().forEach(ps -> ps.setApplication(application));
        applicationRepository.save(application);
        return application;
    }

    @PreAuthorize("hasRole('ROLE_RECRUITER') or hasRole('ROLE_ADMINISTRATOR')")
    public PaginatedResponse<Application> getAllApplications(SearchRequest searchRequest) {
        if (searchRequest == null) searchRequest = new SearchRequest();
        SearchSpecification<Application> applicationSearchSpecification = new SearchSpecification<>(searchRequest);
        Pageable pageable = SearchSpecification.getPageable(searchRequest.getPage(), searchRequest.getSize());
        Page<Application> results = this.applicationRepository.findAll(applicationSearchSpecification, pageable);
        return new PaginatedResponse<>(
                results,
                searchRequest.getPage(),
                results.getTotalPages(),
                results.getTotalElements()
        );
    }

    @PostFilter("hasRole('ROLE_RECRUITER') or hasRole('ROLE_ADMINISTRATOR') or filterObject.createdBy == principal.username")
    public Collection<Application> getApplicationsForUserId(Long userId) {
        return applicationRepository.findByCandidate_User_Id(userId);
    }

    @PostAuthorize("hasRole('ROLE_RECRUITER') or hasRole('ROLE_ADMINISTRATOR') or returnObject.createdBy == principal.username")
    public Application findByJobListingId(Long jobListingId) {
        return applicationRepository.findByJobListing_Id(jobListingId)
                .orElseThrow(() -> new ApplicationNotFoundException("Application for job id %s does not exist".formatted(jobListingId), "jobListingId"));
    }

    @PostAuthorize("hasRole('ROLE_RECRUITER') or hasRole('ROLE_ADMINISTRATOR') or returnObject.createdBy == principal.username")
    public Application findByJobListingIdAndCandidateUsername(Long jobListingId, String username) {
        return applicationRepository.findByJobListingIdAndCandidate_UserUsername(jobListingId, username)
                .orElseThrow(() -> new ApplicationNotFoundException("Application for job id %s and candidate name %s does not exist".formatted(jobListingId, username), "jobListingId"));
    }

    public Application updateApplication(ApplicationInput applicationInput) {
        Application application = applicationRepository.findById(applicationInput.getId())
                .orElseThrow(() -> new ApplicationNotFoundException("Application by id %s does not exist".formatted(applicationInput.getId()), "id"));
        application = applicationMapper.partialUpdate(applicationInput, application);
        applicationRepository.save(application);
        return application;
    }
}
