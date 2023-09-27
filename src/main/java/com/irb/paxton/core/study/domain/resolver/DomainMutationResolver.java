package com.irb.paxton.core.study.domain.resolver;

import com.irb.paxton.core.study.domain.Domain;
import com.irb.paxton.core.study.domain.DomainRepository;
import com.irb.paxton.core.study.domain.input.DomainInput;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.InputArgument;
import org.springframework.beans.factory.annotation.Autowired;

@DgsComponent
public class DomainMutationResolver {

    @Autowired
    private DomainRepository domainRepository;

    @DgsMutation
    public Domain addDomain(@InputArgument DomainInput DomainInput) {
        return this.domainRepository.save(
                new Domain(DomainInput.getName(), null)
        );
    }
}
