package com.irb.paxton.security.auth.user;

import com.irb.paxton.profile.UserProfile;
import com.irb.paxton.profile.UserProfileRepository;
import com.irb.paxton.security.auth.role.PaxtonRole;
import com.irb.paxton.security.auth.role.RoleService;
import com.irb.paxton.security.auth.user.credentials.Credentials;
import com.irb.paxton.security.auth.user.credentials.CredentialsType;
import com.irb.paxton.security.auth.user.dto.UserLoginDto;
import com.irb.paxton.security.auth.user.dto.UserSignupDto;
import com.irb.paxton.security.auth.user.exceptions.InvalidCredentialsException;
import com.irb.paxton.security.auth.user.exceptions.UserAlreadyExistsException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private RoleService roleService;

    public List<User> getUsers() {
        return this.userRepository.findAll();
    }

    public void createUser(User user) {
        this.userRepository.save(user);
    }

    public User findByEmailOrUsername(String email, String username) {
        return this.userRepository.findByEmailOrUsername(email, username);
    }

    public Optional<User> findByEmail(String email) {
        return this.userRepository.findByEmail(email);
    }

    public User findByUsername(String username) {
        return this.userRepository.findByUsername(username);
    }

    public User registerNewUser(UserSignupDto user) throws UserAlreadyExistsException {
        if (findByEmailOrUsername(user.getEmail(), user.getUsername()) != null) {
            throw new UserAlreadyExistsException("Email or username already in use");
        }
        User u = new User(null, user.getFirstName(), user.getLastName(), user.getBirthDate(), user.getEmail(), user.getUsername(),
                List.of(roleService.findByName(PaxtonRole.ROLE_READ_ONLY.toString()), roleService.findByName((PaxtonRole.ROLE_EVERYONE.toString()))),
                new Credentials(null, CredentialsType.PASSWORD, new BCryptPasswordEncoder().encode(user.getPassword()), false, null, null), false);

        userRepository.save(u);
        userProfileRepository.save(new UserProfile(u));
        log.info(String.format("Created user login %s, confirmation email message will initiate", user.getUsername()));

        return u;
    }

    public void loginUser(UserLoginDto userLoginDto) {
        User user = this.userRepository.findByUsername(userLoginDto.getUsername());
        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();

        if (!bCryptPasswordEncoder.matches(userLoginDto.getPassword(), user.getCredentials().getValue())) {
            throw new InvalidCredentialsException("Invalid username/password");
        }
    }

    public User updateUser(User user) {
        return this.userRepository.save(user);
    }

    public void confirmEmailUser(User user) {
        user.setEmailConfirmed(true);
        this.userRepository.save(user);
    }
}
