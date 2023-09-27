package com.irb.paxton.core.organization.resolver;

import com.irb.paxton.core.organization.Organization;
import com.irb.paxton.core.organization.OrganizationService;
import com.irb.paxton.core.organization.input.OrganizationInput;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.InputArgument;
import org.springframework.beans.factory.annotation.Autowired;

@DgsComponent
public class OrganizationMutationResolver {

    @Autowired
    private OrganizationService organizationService;

    @DgsMutation
    public Organization createOrUpdateOrganization(@InputArgument OrganizationInput OrganizationInput) {
        // TODO: Find a fix for the localization/specialization errors (DGS cannot parse the input fields)
        return this.organizationService.createOrUpdateOrganization(OrganizationInput);
    }
}
