package com.irb.paxton.core.profile.resolver;

import com.irb.paxton.core.profile.UserProfile;
import com.irb.paxton.core.profile.UserProfileService;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import graphql.kickstart.tools.GraphQLQueryResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import java.util.Optional;

import static com.irb.paxton.security.SecurityUtils.getCurrentUserLogin;

@Controller
public class UserProfileQueryResolver implements GraphQLQueryResolver {

    @Autowired
    private UserProfileService userProfileService;

    public Optional<UserProfile> getCurrentUserProfile() {
        String currentUser = getCurrentUserLogin().orElseThrow(() -> new UserNotFoundException("User not found"));
        return this.userProfileService.getCurrentUserProfileByUsername(currentUser);
    }
}
