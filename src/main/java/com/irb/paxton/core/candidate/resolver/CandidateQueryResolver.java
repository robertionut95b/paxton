package com.irb.paxton.core.candidate.resolver;

import com.irb.paxton.core.candidate.Candidate;
import com.irb.paxton.core.candidate.CandidateService;
import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SearchRequest;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import org.springframework.beans.factory.annotation.Autowired;

@DgsComponent
public class CandidateQueryResolver {

    @Autowired
    private CandidateService candidateService;

    @DgsQuery
    public PaginatedResponse<Candidate> getAllCandidates(SearchRequest searchRequest) {
        return this.candidateService.getAllCandidates(searchRequest);
    }

    @DgsQuery
    public PaginatedResponse<Candidate> getAllCandidatesByJobListingId(Long JobListingId) {
        return this.candidateService.getAllCandidatesByJobListingId(JobListingId);
    }
}
