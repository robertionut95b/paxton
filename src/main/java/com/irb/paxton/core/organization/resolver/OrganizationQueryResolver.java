package com.irb.paxton.core.organization.resolver;

import com.irb.paxton.core.organization.Organization;
import com.irb.paxton.core.organization.OrganizationRepository;
import com.irb.paxton.core.organization.exception.OrganizationNotExistsException;
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

    public Organization getOrganizationById(Long organizationId) {
        return organizationRepository.findById(organizationId)
                .orElseThrow(() -> new OrganizationNotExistsException(String.format("Organization %s does not exist", organizationId)));
    }
}
