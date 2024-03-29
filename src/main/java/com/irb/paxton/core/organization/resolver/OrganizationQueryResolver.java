package com.irb.paxton.core.organization.resolver;

import com.irb.paxton.core.organization.Organization;
import com.irb.paxton.core.organization.OrganizationRepository;
import com.irb.paxton.core.organization.OrganizationService;
import com.irb.paxton.core.organization.exception.OrganizationNotFoundException;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;

import java.util.List;

@DgsComponent
public class OrganizationQueryResolver {

    private final OrganizationRepository organizationRepository;

    private final OrganizationService organizationService;

    public OrganizationQueryResolver(OrganizationRepository organizationRepository, OrganizationService organizationService) {
        this.organizationRepository = organizationRepository;
        this.organizationService = organizationService;
    }

    @DgsQuery
    public List<Organization> getAllOrganizations() {
        return organizationRepository.findAll();
    }

    @DgsQuery
    public Organization getOrganizationById(@InputArgument Long organizationId) {
        return organizationRepository.findById(organizationId)
                .orElseThrow(() -> new OrganizationNotFoundException("Organization %s does not exist".formatted(organizationId)));
    }

    @DgsQuery
    public Organization getOrganizationBySlugName(@InputArgument String slugName) {
        return this.organizationService.findBySlugName(slugName);
    }
}
