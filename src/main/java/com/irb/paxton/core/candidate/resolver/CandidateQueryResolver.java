package com.irb.paxton.core.candidate.resolver;

import com.irb.paxton.core.candidate.CandidateRepository;
import graphql.kickstart.tools.GraphQLQueryResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class CandidateQueryResolver implements GraphQLQueryResolver {

    @Autowired
    private CandidateRepository candidateRepository;


}
