package com.irb.paxton.core.profile.mapper;

import com.irb.paxton.core.activity.ActivitySector;
import com.irb.paxton.core.activity.ActivitySectorRepository;
import com.irb.paxton.core.activity.exception.ActivitySectorNotExistsException;
import com.irb.paxton.core.location.City;
import com.irb.paxton.core.location.CityRepository;
import com.irb.paxton.core.location.exception.CityNotFoundException;
import com.irb.paxton.core.organization.Organization;
import com.irb.paxton.core.organization.OrganizationRepository;
import com.irb.paxton.core.organization.exception.OrganizationNotExistsException;
import com.irb.paxton.core.profile.UserProfile;
import com.irb.paxton.core.profile.UserProfileRepository;
import com.irb.paxton.core.profile.exception.UserProfileNotFoundException;
import com.irb.paxton.core.profile.experience.Experience;
import com.irb.paxton.core.profile.experience.input.ExperienceInput;
import com.irb.paxton.core.profile.input.UserProfileInput;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserService;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class UserProfileMapper {

    @Autowired
    private CityRepository cityRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private ActivitySectorRepository activitySectorRepository;

    @Autowired
    private UserService userService;

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "studies", ignore = true)
    @Mapping(target = "photography", ignore = true)
    @Mapping(target = "modifiedBy", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "experiences", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "coverPhotography", ignore = true)
    public abstract UserProfile userProfileInputToUserProfile(UserProfileInput userProfileInput);

    public City mapCity(String cityValue) {
        return this.cityRepository.findByName(cityValue)
                .orElseThrow(() -> new CityNotFoundException(String.format("%s does not exist", cityValue), "city"));
    }

    public User mapUser(String username) {
        return this.userService.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(String.format("User %s not found", username)));
    }

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "studies", ignore = true)
    @Mapping(target = "photography", ignore = true)
    @Mapping(target = "modifiedBy", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "experiences", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "coverPhotography", ignore = true)
    @Mapping(target = "userProfile.profileTitle", source = "userProfileInput.profileTitle")
    @Mapping(target = "userProfile.description", source = "userProfileInput.description")
    @Mapping(target = "userProfile.profileSlugUrl", source = "userProfileInput.profileSlugUrl")
    @Mapping(target = "userProfile.city", source = "userProfileInput.city")
    public abstract UserProfile updateUserProfile(@MappingTarget UserProfile userProfile, UserProfileInput userProfileInput);

    @Mapping(target = "username", ignore = true)
    @Mapping(target = "userProfile", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "modifiedBy", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "emailConfirmed", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "credentials", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "birthDate", ignore = true)
    @Mapping(target = "user.lastName", source = "userProfileInput.lastName")
    @Mapping(target = "user.firstName", source = "userProfileInput.firstName")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
    public abstract void updateUserFields(@MappingTarget User user, UserProfileInput userProfileInput);

    @Mapping(target = "userProfile", source = "experienceInput.userProfileSlugUrl")
    @Mapping(target = "organization", source = "experienceInput.organizationId")
    @Mapping(target = "activitySector", source = "experienceInput.activitySectorId")
    @Mapping(target = "modifiedBy", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    public abstract Experience addUserProfileExperience(ExperienceInput experienceInput);

    public UserProfile mapUserProfile(Long userProfileId) {
        return this.userProfileRepository.findById(userProfileId)
                .orElseThrow(() -> new UserProfileNotFoundException(String.format("%s does not exist", userProfileId), "userProfileId"));
    }

    public UserProfile mapUserProfileBySlugUrl(String userProfileSlugUrl) {
        return this.userProfileRepository.findByProfileSlugUrl(userProfileSlugUrl)
                .orElseThrow(() -> new UserProfileNotFoundException(String.format("%s does not exist", userProfileSlugUrl), "userProfileId"));
    }

    public Organization mapOrganization(Long organizationId) {
        return this.organizationRepository.findById(organizationId)
                .orElseThrow(() -> new OrganizationNotExistsException(String.format("%s does not exist", organizationId), "organizationId"));
    }

    public ActivitySector mapActivitySector(Long activitySectorId) {
        return this.activitySectorRepository.findById(activitySectorId)
                .orElseThrow(() -> new ActivitySectorNotExistsException(String.format("%s does not exist", activitySectorId), "activitySectorId"));
    }

    @Mapping(target = "userProfile", source = "experienceInput.userProfileSlugUrl")
    @Mapping(target = "organization", source = "experienceInput.organizationId")
    @Mapping(target = "activitySector", source = "experienceInput.activitySectorId")
    @Mapping(target = "modifiedBy", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
    public abstract Experience updateUserProfileExperience(@MappingTarget Experience experience, ExperienceInput experienceInput);
}
