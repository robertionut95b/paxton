package com.irb.paxton.core.study.certification.resolver;

import com.irb.paxton.core.study.certification.Certification;
import com.irb.paxton.core.study.certification.CertificationRepository;
import com.irb.paxton.core.study.certification.input.CertificationInput;
import graphql.kickstart.tools.GraphQLMutationResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

@Controller
@Validated
public class CertificationMutationResolver implements GraphQLMutationResolver {

    @Autowired
    private CertificationRepository certificationRepository;

    public Certification addCertification(@Valid @NotNull CertificationInput certificationInput) {
        return this.certificationRepository.save(
                new Certification(null, certificationInput.getName(), null)
        );
    }
}
