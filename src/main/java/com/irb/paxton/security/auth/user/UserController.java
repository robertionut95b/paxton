package com.irb.paxton.security.auth.user;

import com.irb.paxton.core.profile.UserProfile;
import com.irb.paxton.core.profile.UserProfileService;
import com.irb.paxton.security.auth.user.dto.UserCreateDto;
import com.irb.paxton.security.auth.user.dto.UserUpdateDto;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import com.irb.paxton.security.auth.user.mapper.UserMapper;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping(path = "api/v1/users")
@Slf4j
public class UserController {

    private final UserService userService;

    private final UserMapper userMapper;

    private final UserProfileService userProfileService;

    public UserController(UserService userService,
                          UserMapper userMapper,
                          UserProfileService userProfileService) {
        this.userService = userService;
        this.userMapper = userMapper;
        this.userProfileService = userProfileService;
    }

    @GetMapping
    @Secured("ROLE_ADMINISTRATOR")
    List<User> getUsers(Authentication authentication) {
        return userService.getUsers();
    }

    @PostMapping
    public User createUser(@Valid UserCreateDto userCreateDto) {
        User user = this.userMapper.dtoToEntity(userCreateDto);
        if (this.userService.findByUsername(user.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Invalid username/password combination");
        }
        User createdUser = userService.create(user);
        // create the profile instance as well
        UserProfile userProfile = new UserProfile(user);
        userProfile.setProfileTitle("No title given");
        userProfileService.create(userProfile);
        return createdUser;
    }

    @PutMapping
    @PostAuthorize("hasRole('ROLE_ADMINISTRATOR') or returnObject.createdBy == authentication.name")
    public User updateUser(@Valid UserUpdateDto userUpdateDto) {
        User user = this.userService.findById(userUpdateDto.getId());
        User userUpdate = this.userMapper.updateUserByDto(user, userUpdateDto);
        return userService.update(userUpdate);
    }

    @DeleteMapping(path = "/{username}")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR') or #username == authentication.name")
    public void deleteUserByUsername(@PathVariable @Valid String username) {
        User userEntity = this.userService
                .findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User does not exist"));
        userService.delete(userEntity);
    }

    @PostMapping(path = "auth-hook", consumes = APPLICATION_JSON_VALUE)
    public void authorizationWebhook(@RequestBody String body) {
        log.info("Received the json body from webhook {}", body);
    }
}
