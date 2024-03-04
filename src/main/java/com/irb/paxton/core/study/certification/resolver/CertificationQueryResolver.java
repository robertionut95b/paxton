package com.irb.paxton.core.study.certification.resolver;

import com.irb.paxton.core.study.certification.Certification;
import com.irb.paxton.core.study.certification.CertificationRepository;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;

import java.util.List;

@DgsComponent
public class CertificationQueryResolver {

    private final CertificationRepository certificationRepository;

    public CertificationQueryResolver(CertificationRepository certificationRepository) {
        this.certificationRepository = certificationRepository;
    }

    @DgsQuery
    public List<Certification> getAllCertifications() {
        return this.certificationRepository.findAll();
    }
}
