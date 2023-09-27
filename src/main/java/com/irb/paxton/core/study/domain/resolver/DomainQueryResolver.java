package com.irb.paxton.core.study.domain.resolver;

import com.irb.paxton.core.study.domain.Domain;
import com.irb.paxton.core.study.domain.DomainRepository;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@DgsComponent
public class DomainQueryResolver {

    @Autowired
    private DomainRepository domainRepository;

    @DgsQuery
    public List<Domain> getAllDomains() {
        return this.domainRepository.findAll();
    }
}
