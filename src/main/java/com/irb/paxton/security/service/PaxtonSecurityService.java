package com.irb.paxton.security.service;

import com.irb.paxton.core.candidate.Application;
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

    public boolean isJobApplicationRecruiter(Authentication authentication, Application application) {
        return application
                .getJobListing()
                .getRecruiter().getUser().getUsername()
                .equals(authentication.getName());
    }
}
