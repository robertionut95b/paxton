package com.irb.paxton.core.profile.resolver;

import com.irb.paxton.core.profile.UserProfile;
import com.irb.paxton.core.profile.UserProfileService;
import com.irb.paxton.core.profile.experience.input.ExperienceInput;
import com.irb.paxton.core.profile.input.UserProfileInput;
import com.irb.paxton.core.study.input.StudyInput;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.InputArgument;

@DgsComponent
public class UserProfileMutationResolver {

    private UserProfileService userProfileService;

    public UserProfileMutationResolver(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @DgsMutation
    public UserProfile updateUserProfile(@InputArgument UserProfileInput UserProfileInput) {
        return this.userProfileService.updateUserProfile(UserProfileInput);
    }

    @DgsMutation
    public UserProfile addUserProfileExperience(@InputArgument ExperienceInput ExperienceInput) {
        return this.userProfileService.saveExperience(ExperienceInput);
    }

    @DgsMutation
    public UserProfile updateUserProfileExperience(@InputArgument ExperienceInput ExperienceInput) {
        return this.userProfileService.updateExperience(ExperienceInput);
    }

    @DgsMutation
    public UserProfile addUserProfileStudy(@InputArgument StudyInput StudyInput) {
        return this.userProfileService.saveStudy(StudyInput);
    }

    @DgsMutation
    public UserProfile updateUserProfileStudy(@InputArgument StudyInput StudyInput) {
        return this.userProfileService.updateStudy(StudyInput);
    }

    @DgsMutation
    public UserProfile removeUserProfileStudy(@InputArgument Long studyId) {
        return this.userProfileService.deleteStudy(studyId);
    }

    @DgsMutation
    public UserProfile removeUserProfileExperience(@InputArgument Long experienceId) {
        return this.userProfileService.deleteExperience(experienceId);
    }
}
