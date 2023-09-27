package com.irb.paxton.core.study.certification.resolver;

import com.irb.paxton.core.study.certification.Certification;
import com.irb.paxton.core.study.certification.CertificationRepository;
import com.irb.paxton.core.study.certification.input.CertificationInput;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.InputArgument;
import org.springframework.beans.factory.annotation.Autowired;

@DgsComponent
public class CertificationMutationResolver {

    @Autowired
    private CertificationRepository certificationRepository;

    @DgsMutation
    public Certification addCertification(@InputArgument CertificationInput CertificationInput) {
        return this.certificationRepository.save(
                new Certification(CertificationInput.getName(), null)
        );
    }
}
