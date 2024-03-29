package com.irb.paxton.core.profile;

import com.irb.paxton.core.model.AbstractRepository;
import com.irb.paxton.core.model.AbstractService;
import com.irb.paxton.core.profile.exception.UserProfileNotFoundException;
import com.irb.paxton.core.profile.experience.Experience;
import com.irb.paxton.core.profile.experience.ExperienceRepository;
import com.irb.paxton.core.profile.experience.exception.ExperienceNotFoundException;
import com.irb.paxton.core.profile.experience.input.ExperienceInput;
import com.irb.paxton.core.profile.input.UserProfileInput;
import com.irb.paxton.core.profile.mapper.UserProfileMapper;
import com.irb.paxton.core.study.Study;
import com.irb.paxton.core.study.StudyRepository;
import com.irb.paxton.core.study.exception.StudyNotFoundException;
import com.irb.paxton.core.study.input.StudyInput;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserService;
import jakarta.transaction.Transactional;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Optional;

@Service
public class UserProfileService extends AbstractService<UserProfile> {

    private final UserProfileRepository userProfileRepository;

    private final UserService userService;

    private final UserProfileMapper userProfileMapper;

    private final ExperienceRepository experienceRepository;

    private final StudyRepository studyRepository;

    protected UserProfileService(AbstractRepository<UserProfile> repository, UserProfileRepository userProfileRepository, UserService userService, UserProfileMapper userProfileMapper, ExperienceRepository experienceRepository, StudyRepository studyRepository) {
        super(repository);
        this.userProfileRepository = userProfileRepository;
        this.userService = userService;
        this.userProfileMapper = userProfileMapper;
        this.experienceRepository = experienceRepository;
        this.studyRepository = studyRepository;
    }

    public Optional<UserProfile> getCurrentUserProfileByUsername(String username) {
        return this.userProfileRepository.findByUserUsername(username);
    }

    public Optional<UserProfile> findBySlugUrl(String profileSlugUrl) {
        return this.userProfileRepository.findByProfileSlugUrl(profileSlugUrl);
    }

    @Transactional
    @PostAuthorize("hasRole('ROLE_ADMINISTRATOR') or @paxtonSecurityService.isOwner(authentication, returnObject.user.username)")
    public UserProfile updateUserProfile(UserProfileInput userProfileInput) {
        UserProfile userProfile = this.userProfileRepository.findById(userProfileInput.getId())
                .orElseThrow(() -> new UserProfileNotFoundException("User profile does not exist"));

        User user = userProfile.getUser();
        if (!userProfileInput.getLastName().equals(user.getLastName())
                || !userProfileInput.getFirstName().equals(user.getFirstName())) {
            userProfileMapper.updateUserFields(user, userProfileInput);
            this.userService.updateUser(user);
        }
        return this.userProfileRepository.update(userProfileMapper.updateUserProfile(userProfile, userProfileInput));
    }

    @Transactional
    @PostAuthorize("hasRole('ROLE_ADMINISTRATOR') or @paxtonSecurityService.isOwner(authentication, returnObject.user.username)")
    public UserProfile saveExperience(ExperienceInput experienceInput) {
        Experience newExperience = this.userProfileMapper.addUserProfileExperience(experienceInput);
        UserProfile userProfile = newExperience.getUserProfile();
        Collection<Experience> experiences = userProfile.getExperiences();
        experiences.add(newExperience);

        userProfile.setExperiences(experiences);
        return this.userProfileRepository.update(userProfile);
    }

    @Transactional
    @PostAuthorize("hasRole('ROLE_ADMINISTRATOR') or @paxtonSecurityService.isOwner(authentication, returnObject.user.username)")
    public UserProfile updateExperience(ExperienceInput experienceInput) {
        Experience actualExperience = this.experienceRepository.findById(experienceInput.getId())
                .orElseThrow(() -> new ExperienceNotFoundException(String.format("%s does not exist", experienceInput.getId().toString())));
        Experience updatedExperience = this.userProfileMapper.updateUserProfileExperience(actualExperience, experienceInput);
        experienceRepository.update(updatedExperience);

        return updatedExperience.getUserProfile();
    }

    @Transactional
    @PostAuthorize("hasRole('ROLE_ADMINISTRATOR') or @paxtonSecurityService.isOwner(authentication, returnObject.user.username)")
    public UserProfile saveStudy(StudyInput studyInput) {
        Study newStudy = this.userProfileMapper.addUserProfileStudy(studyInput);
        UserProfile userProfile = newStudy.getUserProfile();
        Collection<Study> studies = userProfile.getStudies();
        studies.add(newStudy);

        userProfile.setStudies(studies);
        return this.userProfileRepository.update(userProfile);
    }

    @Transactional
    @PostAuthorize("hasRole('ROLE_ADMINISTRATOR') or @paxtonSecurityService.isOwner(authentication, returnObject.user.username)")
    public UserProfile updateStudy(StudyInput studyInput) {
        Study actualStudy = this.studyRepository.findById(studyInput.getId())
                .orElseThrow(() -> new StudyNotFoundException(String.format("%s does not exist", studyInput.getId().toString())));
        Study updatedStudy = this.userProfileMapper.updateUserProfileStudy(actualStudy, studyInput);
        this.studyRepository.update(updatedStudy);
        return updatedStudy.getUserProfile();
    }

    @Transactional
    @PostAuthorize("hasRole('ROLE_ADMINISTRATOR') or @paxtonSecurityService.isOwner(authentication, returnObject.user.username)")
    public UserProfile deleteStudy(Long studyId) {
        Study actualStudy = this.studyRepository.findById(studyId)
                .orElseThrow(() -> new StudyNotFoundException(String.format("Study %s does not exist", studyId)));
        this.studyRepository.deleteById(actualStudy.getId());
        return actualStudy.getUserProfile();
    }

    @Transactional
    @PostAuthorize("hasRole('ROLE_ADMINISTRATOR') or @paxtonSecurityService.isOwner(authentication, returnObject.user.username)")
    public UserProfile deleteExperience(Long experienceId) {
        Experience currentExperience = this.experienceRepository.findById(experienceId)
                .orElseThrow(() -> new ExperienceNotFoundException(String.format("Experience %s does not exist", experienceId)));
        this.experienceRepository.deleteById(currentExperience.getId());
        return currentExperience.getUserProfile();
    }
}
