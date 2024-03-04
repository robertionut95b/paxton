package com.irb.paxton.core.study.domain.resolver;

import com.irb.paxton.core.study.domain.Domain;
import com.irb.paxton.core.study.domain.DomainRepository;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;

import java.util.List;

@DgsComponent
public class DomainQueryResolver {

    private final DomainRepository domainRepository;

    public DomainQueryResolver(DomainRepository domainRepository) {
        this.domainRepository = domainRepository;
    }

    @DgsQuery
    public List<Domain> getAllDomains() {
        return this.domainRepository.findAll();
    }
}
