package com.irb.paxton.core.organization.security;

import com.irb.paxton.core.organization.Organization;
import com.irb.paxton.core.search.PaginatedResponse;
import org.springframework.security.core.Authentication;

import java.util.Collection;

public interface OrganizationSecurityService {

    boolean isOrganizationRecruiter(Authentication authentication, Organization organization);

    boolean isOrganizationRecruiter(Authentication authentication, Long organizationId);

    boolean isOrganizationRecruiter(Authentication authentication, PaginatedResponse<Object> response);

    boolean isOrganizationRecruiter(Authentication authentication, Collection<Object> response);
}
