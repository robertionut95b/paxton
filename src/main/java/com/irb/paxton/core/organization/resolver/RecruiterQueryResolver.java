package com.irb.paxton.core.organization.resolver;

import com.irb.paxton.core.organization.Recruiter;
import com.irb.paxton.core.organization.RecruiterRepository;
import graphql.kickstart.tools.GraphQLQueryResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import java.util.Collection;

@Controller
public class RecruiterQueryResolver implements GraphQLQueryResolver {

    @Autowired
    private RecruiterRepository recruiterRepository;

    public Collection<Recruiter> getAllRecruitersForOrganization(Long organizationId) {
        return this.recruiterRepository.findByOrganizationId(organizationId);
    }
}
