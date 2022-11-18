package com.irb.paxton.core.study.domain.resolver;

import com.irb.paxton.core.study.domain.Domain;
import com.irb.paxton.core.study.domain.DomainRepository;
import com.irb.paxton.core.study.domain.input.DomainInput;
import graphql.kickstart.tools.GraphQLMutationResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

@Controller
@Validated
public class DomainMutationResolver implements GraphQLMutationResolver {

    @Autowired
    private DomainRepository domainRepository;

    public Domain addDomain(@Valid @NotNull DomainInput domainInput) {
        return this.domainRepository.save(
                new Domain(null, domainInput.getName(), null)
        );
    }
}
