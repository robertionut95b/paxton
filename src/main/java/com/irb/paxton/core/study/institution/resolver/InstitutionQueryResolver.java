package com.irb.paxton.core.study.institution.resolver;

import com.irb.paxton.core.study.institution.Institution;
import com.irb.paxton.core.study.institution.InstitutionRepository;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@DgsComponent
public class InstitutionQueryResolver {

    @Autowired
    private InstitutionRepository institutionRepository;

    @DgsQuery
    public List<Institution> getAllInstitutions() {
        return this.institutionRepository.findAll();
    }
}
