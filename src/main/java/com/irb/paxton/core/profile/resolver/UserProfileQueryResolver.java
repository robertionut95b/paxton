package com.irb.paxton.core.profile.resolver;

import com.irb.paxton.core.profile.UserProfile;
import com.irb.paxton.core.profile.UserProfileService;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;

import java.util.Optional;

import static com.irb.paxton.security.SecurityUtils.getCurrentUserLogin;

@DgsComponent
public class UserProfileQueryResolver {

    private UserProfileService userProfileService;

    public UserProfileQueryResolver(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @DgsQuery
    public Optional<UserProfile> getUserProfile(@InputArgument String profileSlugUrl) {
        return this.userProfileService.findBySlugUrl(profileSlugUrl);
    }

    @DgsQuery
    public Optional<UserProfile> getCurrentUserProfile() {
        String currentUser = getCurrentUserLogin().orElseThrow(() -> new UserNotFoundException("User not found"));
        return this.userProfileService.getCurrentUserProfileByUsername(currentUser);
    }
}
