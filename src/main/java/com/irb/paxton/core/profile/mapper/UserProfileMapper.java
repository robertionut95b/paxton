package com.irb.paxton.core.profile.mapper;

import com.irb.paxton.core.activity.ActivitySector;
import com.irb.paxton.core.activity.ActivitySectorRepository;
import com.irb.paxton.core.activity.exception.ActivitySectorNotFoundException;
import com.irb.paxton.core.location.City;
import com.irb.paxton.core.location.CityRepository;
import com.irb.paxton.core.location.exception.CityNotFoundException;
import com.irb.paxton.core.media.Photography;
import com.irb.paxton.core.media.input.PhotographyInput;
import com.irb.paxton.core.organization.Organization;
import com.irb.paxton.core.organization.OrganizationRepository;
import com.irb.paxton.core.organization.exception.OrganizationNotFoundException;
import com.irb.paxton.core.profile.UserProfile;
import com.irb.paxton.core.profile.UserProfileRepository;
import com.irb.paxton.core.profile.exception.UserProfileNotFoundException;
import com.irb.paxton.core.profile.experience.Experience;
import com.irb.paxton.core.profile.experience.input.ExperienceInput;
import com.irb.paxton.core.profile.input.UserProfileInput;
import com.irb.paxton.core.study.Study;
import com.irb.paxton.core.study.certification.Certification;
import com.irb.paxton.core.study.certification.CertificationRepository;
import com.irb.paxton.core.study.domain.Domain;
import com.irb.paxton.core.study.domain.DomainRepository;
import com.irb.paxton.core.study.input.StudyInput;
import com.irb.paxton.core.study.institution.Institution;
import com.irb.paxton.core.study.institution.InstitutionRepository;
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
    private InstitutionRepository institutionRepository;

    @Autowired
    private DomainRepository domainRepository;

    @Autowired
    private CertificationRepository certificationRepository;

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
                .orElseThrow(() -> new CityNotFoundException("%s does not exist".formatted(cityValue)));
    }

    public User mapUser(String username) {
        return this.userService.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User %s not found".formatted(username)));
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

    public UserProfile mapUserProfileBySlugUrl(String userProfileSlugUrl) {
        return this.userProfileRepository.findByProfileSlugUrl(userProfileSlugUrl)
                .orElseThrow(() -> new UserProfileNotFoundException("%s does not exist".formatted(userProfileSlugUrl)));
    }

    public Organization mapOrganization(Long organizationId) {
        return this.organizationRepository.findById(organizationId)
                .orElseThrow(() -> new OrganizationNotFoundException("%s does not exist".formatted(organizationId)));
    }

    public ActivitySector mapActivitySector(Long activitySectorId) {
        return this.activitySectorRepository.findById(activitySectorId)
                .orElseThrow(() -> new ActivitySectorNotFoundException("%s does not exist".formatted(activitySectorId)));
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

    @Mapping(target = "userProfile", source = "studyInput.userProfileSlugUrl")
    @Mapping(target = "modifiedBy", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "institution", source = "studyInput.institution")
    @Mapping(target = "domainStudy", source = "studyInput.domainStudy")
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "certification", source = "studyInput.certification")
    public abstract Study addUserProfileStudy(StudyInput studyInput);

    public Institution mapInstitution(Long institutionId) {
        return this.institutionRepository.findById(institutionId)
                .orElseThrow(() -> new IllegalArgumentException("Institution id was not found"));
    }

    public Domain mapDomain(Long domainId) {
        if (domainId != null) {
            return this.domainRepository.findById(domainId).orElse(null);
        } else return null;
    }

    public Certification mapCertification(Long certificationId) {
        if (certificationId != null) {
            return this.certificationRepository.findById(certificationId).orElse(null);
        } else return null;
    }

    @Mapping(target = "userProfile", source = "studyInput.userProfileSlugUrl")
    @Mapping(target = "modifiedBy", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "institution", source = "studyInput.institution")
    @Mapping(target = "domainStudy", source = "studyInput.domainStudy")
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "certification", source = "studyInput.certification")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
    public abstract Study updateUserProfileStudy(@MappingTarget Study actualStudy, StudyInput studyInput);

    @Mapping(target = "userProfile", source = "photographyInput.userId")
    @Mapping(target = "name", ignore = true)
    @Mapping(target = "path", ignore = true)
    public abstract Photography updateUserProfileBanner(PhotographyInput photographyInput);

    @Mapping(target = "userProfile", source = "photographyInput.userId")
    @Mapping(target = "name", ignore = true)
    @Mapping(target = "path", ignore = true)
    public abstract Photography updateUserProfileAvatar(PhotographyInput photographyInput);

    public UserProfile mapUserProfile(Long userId) {
        return this.userProfileRepository.findByUser_Id(userId)
                .orElseThrow(() -> new UserProfileNotFoundException("%s does not exist".formatted(userId)));
    }
}
