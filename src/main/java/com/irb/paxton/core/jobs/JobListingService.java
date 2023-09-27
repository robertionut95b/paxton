package com.irb.paxton.core.jobs;

import com.irb.paxton.core.jobs.input.JobListingInput;
import com.irb.paxton.core.jobs.mapper.JobListingMapper;
import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SearchRequest;
import com.irb.paxton.core.search.SearchSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

@Service
public class JobListingService {

    @Autowired
    private JobListingRepository jobListingRepository;

    @Autowired
    private JobListingMapper jobListingMapper;

    public List<JobListing> getAllJobListings() {
        return this.jobListingRepository.findAll();
    }

    public PaginatedResponse<JobListing> getAllJobListingsPaginatedFiltered(SearchRequest searchRequest) {
        if (searchRequest == null) searchRequest = new SearchRequest();
        SearchSpecification<JobListing> jobListingSearchSpecification = new SearchSpecification<>(searchRequest);
        Pageable pageable = SearchSpecification.getPageable(searchRequest.getPage(), searchRequest.getSize());
        Page<JobListing> results = this.jobListingRepository.findAll(jobListingSearchSpecification, pageable);
        return new PaginatedResponse<>(
                results,
                searchRequest.getPage(),
                results.getTotalPages(),
                results.getTotalElements()
        );
    }

    @Transactional
    @PostAuthorize("hasRole('ROLE_ADMINISTRATOR') or (hasRole('ROLE_RECRUITER') and @organizationSecurityService.isOrganizationRecruiter(authentication, returnObject.organization))")
    public JobListing publishJobListing(JobListingInput jobListingInput) {
        JobListing jobListing = jobListingMapper.inputToJobListing(jobListingInput);
        jobListingRepository.save(jobListing);
        return jobListing;
    }

    @Transactional
    public Collection<JobListing> findRelatedJobListings(String jobName) {
        return jobListingRepository.findByJobNameAndAvailableFromLessThanEqualAndAvailableToGreaterThanEqual(jobName, LocalDate.now(), LocalDate.now());
    }
}
