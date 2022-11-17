package com.irb.paxton.core.profile.resolver;

import com.irb.paxton.core.profile.UserProfile;
import com.irb.paxton.core.profile.UserProfileService;
import com.irb.paxton.core.profile.experience.input.ExperienceInput;
import com.irb.paxton.core.profile.input.UserProfileInput;
import com.irb.paxton.core.study.input.StudyInput;
import com.irb.paxton.core.study.input.StudyInputCreate;
import graphql.kickstart.tools.GraphQLMutationResolver;
import graphql.kickstart.tools.SchemaParserDictionary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
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

    public UserProfile addUserProfileStudy(@Valid @NotNull StudyInput studyInput) {
        return this.userProfileService.saveStudy(studyInput);
    }

    @Bean
    public SchemaParserDictionary schemaParserDictionary() {
        return new SchemaParserDictionary().add(StudyInputCreate.class);
    }

    public UserProfile addUserProfileStudyCreate(@Valid @NotNull StudyInputCreate studyInputCreate) {
        return this.userProfileService.saveStudy(studyInputCreate);
    }

    public UserProfile updateUserProfileStudy(@Valid @NotNull StudyInput studyInput) {
        return this.userProfileService.updateStudy(studyInput);
    }
}
