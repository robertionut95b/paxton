package com.irb.paxton.core.profile;

import com.irb.paxton.core.location.CityRepository;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Collection;
import java.util.Optional;

@Service
public class UserProfileService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private CityRepository cityRepository;

    @Autowired
    private UserProfileMapper userProfileMapper;

    @Autowired
    private ExperienceRepository experienceRepository;

    @Autowired
    private StudyRepository studyRepository;

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
                .orElseThrow(() -> new UserProfileNotFoundException("User profile does not exist", "id"));

        User user = userProfile.getUser();
        if (!userProfileInput.getLastName().equals(user.getLastName())
                || !userProfileInput.getFirstName().equals(user.getFirstName())) {
            userProfileMapper.updateUserFields(user, userProfileInput);
            this.userService.updateUser(user);
        }
        return this.userProfileRepository.save(userProfileMapper.updateUserProfile(userProfile, userProfileInput));
    }

    @Transactional
    @PostAuthorize("hasRole('ROLE_ADMINISTRATOR') or @paxtonSecurityService.isOwner(authentication, returnObject.user.username)")
    public UserProfile saveExperience(ExperienceInput experienceInput) {
        Experience newExperience = this.userProfileMapper.addUserProfileExperience(experienceInput);
        UserProfile userProfile = newExperience.getUserProfile();
        Collection<Experience> experiences = userProfile.getExperiences();
        experiences.add(newExperience);

        userProfile.setExperiences(experiences);
        return this.userProfileRepository.save(userProfile);
    }

    @Transactional
    @PostAuthorize("hasRole('ROLE_ADMINISTRATOR') or @paxtonSecurityService.isOwner(authentication, returnObject.user.username)")
    public UserProfile updateExperience(ExperienceInput experienceInput) {
        Experience actualExperience = this.experienceRepository.findById(experienceInput.getId())
                .orElseThrow(() -> new ExperienceNotFoundException(String.format("%s does not exist", experienceInput.getId().toString()), "id"));
        Experience updatedExperience = this.userProfileMapper.updateUserProfileExperience(actualExperience, experienceInput);
        experienceRepository.save(updatedExperience);

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
        return this.userProfileRepository.save(userProfile);
    }

    @Transactional
    @PostAuthorize("hasRole('ROLE_ADMINISTRATOR') or @paxtonSecurityService.isOwner(authentication, returnObject.user.username)")
    public UserProfile updateStudy(StudyInput studyInput) {
        Study actualStudy = this.studyRepository.findById(studyInput.getId())
                .orElseThrow(() -> new StudyNotFoundException(String.format("%s does not exist", studyInput.getId().toString()), "id"));
        Study updatedStudy = this.userProfileMapper.updateUserProfileStudy(actualStudy, studyInput);
        this.studyRepository.save(updatedStudy);

        return updatedStudy.getUserProfile();
    }
}
