package com.irb.paxton.core.candidate.resolver;

import com.irb.paxton.core.candidate.Candidate;
import com.irb.paxton.core.candidate.CandidateService;
import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SearchRequest;
import graphql.kickstart.tools.GraphQLQueryResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class CandidateQueryResolver implements GraphQLQueryResolver {

    @Autowired
    private CandidateService candidateService;

    PaginatedResponse<Candidate> getAllCandidates(SearchRequest searchRequest) {
        return this.candidateService.getAllCandidates(searchRequest);
    }

    PaginatedResponse<Candidate> getAllCandidatesByJobListingId(Long JobListingId) {
        return this.candidateService.getAllCandidatesByJobListingId(JobListingId);
    }
}
