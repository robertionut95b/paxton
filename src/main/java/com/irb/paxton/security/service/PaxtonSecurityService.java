package com.irb.paxton.security.service;

import com.irb.paxton.core.candidate.Application;
import com.irb.paxton.core.organization.Organization;
import com.irb.paxton.core.search.PaginatedResponse;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Collection;

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

    public boolean isOrganizationRecruiter(Authentication authentication, PaginatedResponse<Object> response) {
        Page<Object> list = response.getList();
        return list.stream().allMatch(o -> {
            if (o instanceof Application application) {
                Organization organization = application.getJobListing().getOrganization();
                return organization
                        .getRecruiters()
                        .stream()
                        .anyMatch(
                                recruiter -> recruiter.getUser().getUsername()
                                        .equals(authentication.getName())
                        );
            } else return false;
        });
    }

    public boolean isOrganizationRecruiter(Authentication authentication, Collection<Object> response) {
        return response.stream().allMatch(o -> {
            if (o instanceof Application application) {
                Organization organization = application.getJobListing().getOrganization();
                return organization
                        .getRecruiters()
                        .stream()
                        .anyMatch(
                                recruiter -> recruiter.getUser().getUsername()
                                        .equals(authentication.getName())
                        );
            } else return false;
        });
    }

    public boolean isJobApplicationRecruiter(Authentication authentication, Application application) {
        return application
                .getJobListing()
                .getRecruiter().getUser().getUsername()
                .equals(authentication.getName());
    }
}
