package com.irb.paxton.core.study.institution.resolver;

import com.irb.paxton.core.study.institution.Institution;
import com.irb.paxton.core.study.institution.InstitutionRepository;
import com.irb.paxton.core.study.institution.input.InstitutionInput;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.InputArgument;

@DgsComponent
public class InstitutionMutationResolver {

    private final InstitutionRepository institutionRepository;

    public InstitutionMutationResolver(InstitutionRepository institutionRepository) {
        this.institutionRepository = institutionRepository;
    }

    @DgsMutation
    public Institution addInstitution(@InputArgument InstitutionInput InstitutionInput) {
        return this.institutionRepository.persist(
                new Institution(
                        InstitutionInput.getName(),
                        InstitutionInput.getDescription(),
                        InstitutionInput.getPhotography(), null)
        );
    }
}
