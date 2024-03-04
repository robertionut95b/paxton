package com.irb.paxton.core.jobs;

import com.irb.paxton.core.jobs.input.JobListingInput;
import com.irb.paxton.core.jobs.mapper.JobListingMapper;
import com.irb.paxton.core.model.AbstractRepository;
import com.irb.paxton.core.model.AbstractService;
import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SearchRequest;
import com.irb.paxton.core.search.SearchSpecification;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

@Service
@Validated
public class JobListingService extends AbstractService<JobListing> {

    private final JobListingRepository jobListingRepository;

    private final JobListingMapper jobListingMapper;

    protected JobListingService(AbstractRepository<JobListing> repository, JobListingRepository jobListingRepository, JobListingMapper jobListingMapper) {
        super(repository);
        this.jobListingRepository = jobListingRepository;
        this.jobListingMapper = jobListingMapper;
    }

    public List<JobListing> getAllJobListings() {
        return this.jobListingRepository.findAll();
    }

    public PaginatedResponse<JobListing> getAllJobListingsPaginatedFiltered(@Valid SearchRequest searchRequest) {
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
        this.create(jobListing);
        return jobListing;
    }

    @Transactional
    public Collection<JobListing> findRelatedJobListings(String jobName) {
        return jobListingRepository.findByJobNameAndAvailableFromLessThanEqualAndAvailableToGreaterThanEqual(jobName, LocalDate.now(), LocalDate.now());
    }
}
