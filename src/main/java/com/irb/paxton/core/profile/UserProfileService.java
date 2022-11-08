package com.irb.paxton.core.profile;

import com.irb.paxton.core.location.City;
import com.irb.paxton.core.location.CityRepository;
import com.irb.paxton.core.profile.input.UserProfileInput;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserService;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public Optional<UserProfile> getCurrentUserProfileByUsername(String username) {
        return this.userProfileRepository.findByUserUsername(username);
    }

    public UserProfile updateUserProfile(UserProfileInput userProfileInput) {
        String username = getCurrentUserLogin().orElseThrow(() -> new UserNotFoundException("User not found"));
        User user = userService.findByUsername(username).orElseThrow(() -> new UserNotFoundException("User not found"));
        City city = cityRepository.findByName(userProfileInput.getCity()).orElseThrow(IllegalArgumentException::new);

        if (!userProfileInput.getLastName().equals(user.getLastName())
                || !userProfileInput.getFirstName().equals(user.getFirstName())) {
            user.setFirstName(userProfileInput.getFirstName());
            user.setLastName(userProfileInput.getLastName());
            this.userService.updateUser(user);
        }

        Optional<UserProfile> userProfileOptional = this.userProfileRepository.findByUserUsername(username);
        if (userProfileOptional.isPresent()) {
            UserProfile userProfile = userProfileOptional.get();
            userProfile.setProfileTitle(userProfileInput.getProfileTitle());
            userProfile.setDescription(userProfileInput.getDescription());
            userProfile.setCity(city);
            return this.userProfileRepository.save(userProfile);
        }

        return this.userProfileRepository.save(
                new UserProfile(null, user, "", "", userProfileInput.getDescription(), city,
                        username + System.currentTimeMillis(), null, userProfileInput.getProfileTitle(), null)
        );
    }
}
