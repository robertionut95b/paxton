package com.irb.paxton.security.service;

import com.irb.paxton.core.organization.Organization;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service(value = "paxtonSecurityService")
public class PaxtonSecurityService {
    /**
     * Security based expressions used in application's security enhancement
     */

    public boolean isOwner(Authentication authentication, String userName) {
        return authentication.getName().equals(userName);
    }

    public boolean isOrganizationRecruiter(Authentication authentication, Organization organization) {
        return organization
                .getRecruiters()
                .stream()
                .anyMatch(
                        recruiter -> recruiter.getUser().getUsername()
                                .equals(authentication.getName())
                );
    }
}
