package com.irb.paxton.core.study.domain.resolver;

import com.irb.paxton.core.study.domain.Domain;
import com.irb.paxton.core.study.domain.DomainRepository;
import com.irb.paxton.core.study.domain.input.DomainInput;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.InputArgument;

@DgsComponent
public class DomainMutationResolver {

    private final DomainRepository domainRepository;

    public DomainMutationResolver(DomainRepository domainRepository) {
        this.domainRepository = domainRepository;
    }

    @DgsMutation
    public Domain addDomain(@InputArgument DomainInput DomainInput) {
        return this.domainRepository.persist(
                new Domain(DomainInput.getName(), null)
        );
    }
}
