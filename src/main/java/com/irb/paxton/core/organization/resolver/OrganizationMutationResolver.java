package com.irb.paxton.core.organization.resolver;

import com.irb.paxton.core.organization.Organization;
import com.irb.paxton.core.organization.OrganizationService;
import com.irb.paxton.core.organization.input.OrganizationInput;
import graphql.kickstart.tools.GraphQLMutationResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class OrganizationMutationResolver implements GraphQLMutationResolver {

    @Autowired
    private OrganizationService organizationService;

    public Organization createOrUpdateOrganization(OrganizationInput organizationInput) {
        return this.organizationService.createOrUpdateOrganization(organizationInput);
    }
}
