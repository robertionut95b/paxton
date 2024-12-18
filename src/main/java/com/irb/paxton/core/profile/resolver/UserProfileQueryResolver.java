package com.irb.paxton.core.profile.resolver;

import com.irb.paxton.core.profile.UserProfile;
import com.irb.paxton.core.profile.UserProfileService;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;

import java.util.Optional;

@DgsComponent
public class UserProfileQueryResolver {

    private final UserProfileService userProfileService;

    public UserProfileQueryResolver(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @DgsQuery
    public Optional<UserProfile> getUserProfile(@InputArgument String profileSlugUrl) {
        return this.userProfileService.findBySlugUrl(profileSlugUrl);
    }
}
