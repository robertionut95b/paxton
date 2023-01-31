package com.irb.paxton.core.candidate;

import com.irb.paxton.core.candidate.input.ApplicationInput;
import com.irb.paxton.core.candidate.mapper.ApplicationMapper;
import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SearchRequest;
import com.irb.paxton.core.search.SearchSpecification;
import com.irb.paxton.security.auth.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Service
public class ApplicationService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    private ApplicationRepository applicationRepository;
    @Autowired
    private ApplicationMapper applicationMapper;

    public Application applyToJobListing(ApplicationInput applicationInput) {
        Application application = applicationMapper.inputToApplication(applicationInput);
        application.getProcessSteps().forEach(ps -> ps.setApplication(application));
        applicationRepository.save(application);
        return application;
    }

    @PreAuthorize("hasRole('ROLE_RECRUITER') or hasRole('ROLE_ADMINISTRATOR')")
    public PaginatedResponse<Application> getAllApplicationsByJobListingId(SearchRequest searchRequest) {
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
}
