package com.irb.paxton.core.study.domain.resolver;

import com.irb.paxton.core.study.domain.Domain;
import com.irb.paxton.core.study.domain.DomainRepository;
import graphql.kickstart.tools.GraphQLQueryResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class DomainQueryResolver implements GraphQLQueryResolver {

    @Autowired
    private DomainRepository domainRepository;

    public List<Domain> getAllDomains() {
        return this.domainRepository.findAll();
    }
}
