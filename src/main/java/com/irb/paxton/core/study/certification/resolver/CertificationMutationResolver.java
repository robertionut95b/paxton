package com.irb.paxton.core.study.certification.resolver;

import com.irb.paxton.core.study.certification.Certification;
import com.irb.paxton.core.study.certification.CertificationRepository;
import com.irb.paxton.core.study.certification.input.CertificationInput;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.InputArgument;

@DgsComponent
public class CertificationMutationResolver {

    private CertificationRepository certificationRepository;

    public CertificationMutationResolver(CertificationRepository certificationRepository) {
        this.certificationRepository = certificationRepository;
    }

    @DgsMutation
    public Certification addCertification(@InputArgument CertificationInput CertificationInput) {
        return this.certificationRepository.persist(
                new Certification(CertificationInput.getName(), null)
        );
    }
}
