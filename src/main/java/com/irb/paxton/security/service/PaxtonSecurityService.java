package com.irb.paxton.security.service;

import com.irb.paxton.core.candidate.Application;
import com.irb.paxton.security.SecurityUtils;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service(value = "paxtonSecurityService")
public class PaxtonSecurityService {
    /**
     * Security based expressions used in application's security enhancement
     */

    @Autowired
    private UserService userService;

    public boolean isCurrentUserById(Long userId) {
        Authentication authentication = SecurityUtils.getCurrentUserAuth();
        User user = userService.findById(userId);
        return authentication.getName().equalsIgnoreCase(user.getUsername());
    }

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
