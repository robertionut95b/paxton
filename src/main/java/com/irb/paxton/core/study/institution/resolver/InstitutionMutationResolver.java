package com.irb.paxton.core.study.institution.resolver;

import com.irb.paxton.core.study.institution.Institution;
import com.irb.paxton.core.study.institution.InstitutionRepository;
import com.irb.paxton.core.study.institution.input.InstitutionInput;
import graphql.kickstart.tools.GraphQLMutationResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

@Controller
@Validated
public class InstitutionMutationResolver implements GraphQLMutationResolver {

    @Autowired
    private InstitutionRepository institutionRepository;

    public Institution addInstitution(@Valid @NotNull InstitutionInput institutionInput) {
        return this.institutionRepository.save(
                new Institution(null,
                        institutionInput.getName(),
                        institutionInput.getDescription(),
                        institutionInput.getPhotography(), null)
        );
    }
}
