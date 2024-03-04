package com.irb.paxton.core.study.institution.resolver;

import com.irb.paxton.core.study.institution.Institution;
import com.irb.paxton.core.study.institution.InstitutionRepository;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;

import java.util.List;

@DgsComponent
public class InstitutionQueryResolver {

    private final InstitutionRepository institutionRepository;

    public InstitutionQueryResolver(InstitutionRepository institutionRepository) {
        this.institutionRepository = institutionRepository;
    }

    @DgsQuery
    public List<Institution> getAllInstitutions() {
        return this.institutionRepository.findAll();
    }
}
