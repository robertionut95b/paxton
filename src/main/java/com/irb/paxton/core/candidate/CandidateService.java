package com.irb.paxton.core.candidate;

import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SearchRequest;
import com.irb.paxton.core.search.SearchSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Service
public class CandidateService {

    @Autowired
    private CandidateRepository candidateRepository;

    @PreAuthorize("hasRole('ROLE_RECRUITER') or hasRole('ROLE_ADMINISTRATOR')")
    public PaginatedResponse<Candidate> getAllCandidates(SearchRequest searchRequest) {
        if (searchRequest == null) searchRequest = new SearchRequest();
        SearchSpecification<Candidate> candidateSearchSpecification = new SearchSpecification<>(searchRequest);
        Pageable pageable = SearchSpecification.getPageable(searchRequest.getPage(), searchRequest.getSize());
        Page<Candidate> results = this.candidateRepository.findAll(candidateSearchSpecification, pageable);
        return new PaginatedResponse<>(
                results,
                searchRequest.getPage(),
                results.getTotalPages(),
                results.getTotalElements()
        );
    }

    @PreAuthorize("hasRole('ROLE_RECRUITER') or hasRole('ROLE_ADMINISTRATOR')")
    public PaginatedResponse<Candidate> getAllCandidatesByJobListingId(Long jobListingId) {
        SearchRequest searchRequest = new SearchRequest();
        Pageable pageable = SearchSpecification.getPageable(searchRequest.getPage(), searchRequest.getSize());
        Page<Candidate> results = this.candidateRepository.findAll(candidateByJobListing(jobListingId), pageable);
        return new PaginatedResponse<>(
                results,
                searchRequest.getPage(),
                results.getTotalPages(),
                results.getTotalElements()
        );
    }

    private Specification<Candidate> candidateByJobListing(Long jobListingId) {
        return (root, query, criteriaBuilder)
                -> criteriaBuilder.equal(root.join("applications").get("jobListing").get("id"), jobListingId);
    }
}
