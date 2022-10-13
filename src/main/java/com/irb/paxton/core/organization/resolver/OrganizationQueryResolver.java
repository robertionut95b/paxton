package com.irb.paxton.core.organization.resolver;

import com.irb.paxton.core.organization.Organization;
import com.irb.paxton.core.organization.OrganizationRepository;
import graphql.kickstart.tools.GraphQLQueryResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class OrganizationQueryResolver implements GraphQLQueryResolver {

    @Autowired
    private OrganizationRepository organizationRepository;

    public List<Organization> getAllOrganizations() {
        return organizationRepository.findAll();
    }
}
