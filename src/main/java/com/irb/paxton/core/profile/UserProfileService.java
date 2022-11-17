package com.irb.paxton.core.profile;

import com.irb.paxton.core.location.CityRepository;
import com.irb.paxton.core.profile.experience.Experience;
import com.irb.paxton.core.profile.experience.ExperienceRepository;
import com.irb.paxton.core.profile.experience.exception.ExperienceNotFoundException;
import com.irb.paxton.core.profile.experience.input.ExperienceInput;
import com.irb.paxton.core.profile.input.UserProfileInput;
import com.irb.paxton.core.profile.mapper.UserProfileMapper;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserService;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Optional;

import static com.irb.paxton.security.SecurityUtils.getCurrentUserLogin;

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

    public Optional<UserProfile> getCurrentUserProfileByUsername(String username) {
        return this.userProfileRepository.findByUserUsername(username);
    }

    public Optional<UserProfile> findBySlugUrl(String profileSlugUrl) {
        return this.userProfileRepository.findByProfileSlugUrl(profileSlugUrl);
    }

    public UserProfile updateUserProfile(UserProfileInput userProfileInput) {
        String username = getCurrentUserLogin().orElseThrow(() -> new UserNotFoundException("User not found"));
        User user = userService.findByUsername(username).orElseThrow(() -> new UserNotFoundException("User not found"));

        if (!userProfileInput.getLastName().equals(user.getLastName())
                || !userProfileInput.getFirstName().equals(user.getFirstName())) {
            userProfileMapper.updateUserFields(user, userProfileInput);
            this.userService.updateUser(user);
        }

        Optional<UserProfile> userProfileOptional = this.userProfileRepository.findByUserUsername(username);
        if (userProfileOptional.isPresent()) {
            UserProfile userProfile = userProfileOptional.get();
            return this.userProfileRepository.save(userProfileMapper.updateUserProfile(userProfile, userProfileInput));
        }

        return this.userProfileRepository.save(userProfileMapper.userProfileInputToUserProfile(userProfileInput));
    }

    public UserProfile saveExperience(ExperienceInput experienceInput) {
        Experience newExperience = this.userProfileMapper.addUserProfileExperience(experienceInput);
        UserProfile userProfile = newExperience.getUserProfile();
        Collection<Experience> experiences = userProfile.getExperiences();
        experiences.add(newExperience);

        userProfile.setExperiences(experiences);
        return this.userProfileRepository.save(userProfile);
    }

    public UserProfile updateExperience(ExperienceInput experienceInput) {
        Experience actualExperience = this.experienceRepository.findById(experienceInput.getId())
                .orElseThrow(() -> new ExperienceNotFoundException(String.format("%s does not exist", experienceInput.getId().toString()), "id"));
        Experience updatedExperience = this.userProfileMapper.updateUserProfileExperience(actualExperience, experienceInput);
        experienceRepository.save(updatedExperience);

        return updatedExperience.getUserProfile();
    }
}
