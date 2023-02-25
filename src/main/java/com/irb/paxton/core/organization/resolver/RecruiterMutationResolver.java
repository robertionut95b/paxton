package com.irb.paxton.core.organization.resolver;

import com.irb.paxton.core.organization.Recruiter;
import com.irb.paxton.core.organization.RecruiterService;
import com.irb.paxton.core.organization.input.RecruiterInput;
import graphql.kickstart.tools.GraphQLMutationResolver;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import java.util.Collection;
import java.util.List;

@Controller
@Slf4j
public class RecruiterMutationResolver implements GraphQLMutationResolver {

    @Autowired
    private RecruiterService recruiterService;

    public Collection<Recruiter> alterRecruitersInOrganization(List<RecruiterInput> recruiterInput, Long organizationId) {
        return recruiterService.alterRecruitersInOrganization(recruiterInput, organizationId);
    }
}
