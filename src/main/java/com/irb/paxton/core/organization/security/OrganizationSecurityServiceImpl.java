package com.irb.paxton.core.organization.security;

import com.irb.paxton.core.candidate.Application;
import com.irb.paxton.core.organization.Organization;
import com.irb.paxton.core.organization.OrganizationService;
import com.irb.paxton.core.organization.Recruiter;
import com.irb.paxton.core.search.PaginatedResponse;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service(value = "organizationSecurityService")
public class OrganizationSecurityServiceImpl implements OrganizationSecurityService {

    private final OrganizationService organizationService;

    public OrganizationSecurityServiceImpl(OrganizationService organizationService) {
        this.organizationService = organizationService;
    }

    @Override
    public boolean isOrganizationRecruiter(Authentication authentication, Organization organization) {
        return organization
                .getRecruiters()
                .stream()
                .anyMatch(recruiter -> recruiter.getUser().getUsername()
                        .equals(authentication.getName()));
    }

    @Override
    public boolean isOrganizationRecruiter(Authentication authentication, Long organizationId) {
        Organization organization = organizationService.findById(organizationId);
        return this.isOrganizationRecruiter(authentication, organization);
    }

    public boolean isOrganizationRecruiter(Authentication authentication, String organizationSlug) {
        Organization organization = organizationService.findBySlugName(organizationSlug);
        return this.isOrganizationRecruiter(authentication, organization);
    }

    @Override
    public boolean isOrganizationRecruiter(Authentication authentication, PaginatedResponse<Object> response) {
        Page<Object> list = response.getList();
        return list.stream().allMatch(o -> {
            if (o instanceof Application application) {
                Organization organization = application.getJobListing().getOrganization();
                return this.isOrganizationRecruiter(authentication, organization);
            } else if (o instanceof Recruiter recruiter) {
                Organization organization = recruiter.getOrganization();
                return this.isOrganizationRecruiter(authentication, organization);
            } else return false;
        });
    }

    @Override
    public boolean isOrganizationRecruiter(Authentication authentication, Collection<Object> response) {
        return response.stream().allMatch(o -> {
            if (o instanceof Application application) {
                Organization organization = application.getJobListing().getOrganization();
                return this.isOrganizationRecruiter(authentication, organization);
            } else if (o instanceof Recruiter recruiter) {
                Organization organization = recruiter.getOrganization();
                return this.isOrganizationRecruiter(authentication, organization);
            } else return false;
        });
    }
}
