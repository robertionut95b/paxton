package com.irb.paxton.core.profile.resolver;

import com.irb.paxton.core.profile.UserProfile;
import com.irb.paxton.core.profile.UserProfileService;
import com.irb.paxton.core.profile.experience.input.ExperienceInput;
import com.irb.paxton.core.profile.input.UserProfileInput;
import graphql.kickstart.tools.GraphQLMutationResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

@Controller
@Validated
@RequiredArgsConstructor
public class UserProfileMutationResolver implements GraphQLMutationResolver {

    @Autowired
    private UserProfileService userProfileService;

    public UserProfile updateUserProfile(@Valid @NotNull UserProfileInput UserProfileInput) {
        return this.userProfileService.updateUserProfile(UserProfileInput);
    }

    public UserProfile addUserProfileExperience(@Valid @NotNull ExperienceInput experienceInput) {
        return this.userProfileService.saveExperience(experienceInput);
    }

    public UserProfile updateUserProfileExperience(@Valid @NotNull ExperienceInput experienceInput) {
        return this.userProfileService.updateExperience(experienceInput);
    }
}
