package com.irb.paxton.security.auth.user;

import com.irb.paxton.core.model.AbstractRepository;
import com.irb.paxton.core.model.AbstractService;
import com.irb.paxton.core.organization.Organization;
import com.irb.paxton.core.organization.Recruiter;
import com.irb.paxton.core.organization.RecruiterRepository;
import com.irb.paxton.core.profile.UserProfile;
import com.irb.paxton.core.profile.UserProfileRepository;
import com.irb.paxton.security.SecurityUtils;
import com.irb.paxton.security.auth.role.PaxtonRole;
import com.irb.paxton.security.auth.role.RoleService;
import com.irb.paxton.security.auth.user.credentials.Credentials;
import com.irb.paxton.security.auth.user.credentials.CredentialsType;
import com.irb.paxton.security.auth.user.dto.UserSignupDto;
import com.irb.paxton.security.auth.user.exceptions.UserAlreadyExistsException;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import com.irb.paxton.security.auth.user.response.CurrentUserDetails;
import com.irb.paxton.security.oauth2.AuthProvider;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
public class UserService extends AbstractService<User> {

    private final UserRepository userRepository;

    private final UserProfileRepository userProfileRepository;

    private final RoleService roleService;

    private final RecruiterRepository recruiterRepository;

    protected UserService(AbstractRepository<User> repository, UserRepository userRepository, UserProfileRepository userProfileRepository, RoleService roleService, RecruiterRepository recruiterRepository) {
        super(repository);
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.roleService = roleService;
        this.recruiterRepository = recruiterRepository;
    }

    public List<User> getUsers() {
        return this.userRepository.findAll();
    }

    public Optional<User> getCurrentUser() {
        Authentication authentication = SecurityUtils.getCurrentUserAuth();
        return this.userRepository.findByUsername(authentication.getName());
    }

    public User findByEmailOrUsername(String email, String username) {
        return this.userRepository.findByEmailOrUsername(email, username);
    }

    public Optional<User> findByEmail(String email) {
        return this.userRepository.findByEmail(email);
    }

    public Optional<User> findByUsername(String username) {
        return this.userRepository.findByUsername(username);
    }

    public User updateUser(User user) {
        return this.update(user);
    }

    public void confirmEmailUser(User user) {
        user.setEmailConfirmed(true);
        this.update(user);
    }

    @Transactional
    public User registerNewUser(UserSignupDto user) throws UserAlreadyExistsException {
        if (findByEmailOrUsername(user.getEmail(), user.getUsername()) != null) {
            throw new UserAlreadyExistsException("Email or username already in use");
        }
        User returnUser = new User(user.getFirstName(), user.getLastName(), user.getBirthDate(), user.getEmail(), user.getUsername(),
                List.of(roleService.findByName((PaxtonRole.ROLE_EVERYONE.toString()))),
                new Credentials(CredentialsType.PASSWORD, new BCryptPasswordEncoder().encode(user.getPassword()), false, null, null), false);

        UserProfile userProfile = new UserProfile(returnUser, null, null, null, null,
                null, null, String.format("%s's Profile", returnUser.getUsername()), null);

        this.create(returnUser);
        userProfileRepository.persist(userProfile);

        return returnUser;
    }

    @Transactional
    public User registerNewUser(User user) throws UserAlreadyExistsException {
        if (findByEmailOrUsername(user.getEmail(), user.getUsername()) != null) {
            throw new UserAlreadyExistsException("Email or username already in use");
        }
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            user.setRoles(List.of(roleService.findByName((PaxtonRole.ROLE_EVERYONE.toString()))));
        }
        this.create(user);
        userProfileRepository.persist(
                new UserProfile(user, null, null, null, null,
                        null, null, String.format("%s's Profile", user.getUsername()), null)
        );
        return user;
    }

    public CurrentUserDetails getCurrentUserDetails(String username) {
        User user = this.userRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException("User not found"));
        Optional<Recruiter> recruiterOptional = this.recruiterRepository.findByUser_Username(user.getUsername());
        if (recruiterOptional.isPresent()) {
            Recruiter recruiter = recruiterOptional.get();
            Organization organization = recruiter.getOrganization();
            return new CurrentUserDetails(organization);
        }
        return new CurrentUserDetails();
    }

    public boolean checkUserIsInRole(String userName, String roleName) {
        return userRepository.existsByRoles_NameAndUsername(roleName, userName);
    }

    public Optional<User> findByEmailAndAuthProviders(String email, AuthProvider authProvider) {
        return userRepository.findByEmailAndAuthProviders(email, authProvider);
    }
}
