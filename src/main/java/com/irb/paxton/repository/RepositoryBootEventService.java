package com.irb.paxton.repository;

import com.irb.paxton.core.profile.UserProfile;
import com.irb.paxton.core.profile.UserProfileService;
import com.irb.paxton.security.auth.KeycloakProviderService;
import com.irb.paxton.security.auth.role.PaxtonRole;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Hex;
import org.apache.commons.lang3.RandomStringUtils;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static com.irb.paxton.config.properties.ApplicationProperties.APP_SYSTEM_USER;

@Service
@Slf4j
@RequiredArgsConstructor
public class RepositoryBootEventService {

    public static final String LOG_CREATE_DEFAULT_USER_MSG = "Registering default user {} with credentials value=\"{}\". " +
            "Please note this down as it is automatically generated";

    private final RepositorySetupRepository setupRepository;

    private final KeycloakProviderService keycloakProviderService;

    private final UserProfileService userProfileService;

    private final UserService userService;

    public void setupApplicationRepository() {
        RepositorySetup repositorySetupRecord = this.setupRepository.findByIsActive(true);

        if (repositorySetupRecord != null) {
            log.info("Repository available for Paxton app! Reading latest metadata");
            return;
        }

        log.info("Paxton application is building up, initiating repository start-up");
        log.info("Paxton : Creating auth objects ...");

        this.setupAuthenticationRepository();

        this.setupRepository.persist(new RepositorySetup(true, "INITIAL_AUTH_USERS_SETUP", "0.0.0"));
        log.info("Paxton app finished initializing repository, moving on ...");
    }

    @Transactional
    public void setupAuthenticationRepository() {
        Optional<UserRepresentation> user = keycloakProviderService.getUser("pxSystemUser");
        user.ifPresent(userRepresentation -> keycloakProviderService.removeUser(userRepresentation.getUsername()));
        this.generateAndSaveUser(APP_SYSTEM_USER, "system@paxton.com", "System", "Paxton",
                List.of(PaxtonRole.ROLE_ADMINISTRATOR.toString(), PaxtonRole.ROLE_EVERYONE.toString()));

        user = keycloakProviderService.getUser("admin");
        user.ifPresent(userRepresentation -> keycloakProviderService.removeUser(userRepresentation.getUsername()));
        this.generateAndSaveUser("admin", "admin@paxton.com", "Admin", "Paxton",
                List.of(PaxtonRole.ROLE_ADMINISTRATOR.toString(), PaxtonRole.ROLE_EVERYONE.toString()));

        user = keycloakProviderService.getUser("readOnly");
        user.ifPresent(userRepresentation -> keycloakProviderService.removeUser(userRepresentation.getUsername()));
        this.generateAndSaveUser("readonly", "readonly@paxton.com", "ReadOnly", "Paxton",
                List.of(PaxtonRole.ROLE_EVERYONE.toString()));

        user = keycloakProviderService.getUser("pxRecruiter");
        user.ifPresent(userRepresentation -> keycloakProviderService.removeUser(userRepresentation.getUsername()));
        this.generateAndSaveUser("pxrecruiter", "pxrecruiter@paxton.com", "Recruiter", "Paxton",
                List.of(PaxtonRole.ROLE_RECRUITER.toString(), PaxtonRole.ROLE_EVERYONE.toString()));
    }

    public void generateAndSaveUser(String username, String email, String firstName, String lastName, List<String> roles) {
        int bytesCount = 12;
        // create a random password
        byte[] bytePassword = RandomStringUtils.random(bytesCount, true, true).getBytes();
        String password = Hex.encodeHexString(bytePassword);

        // create the user app data - internal user and user profile
        UserProfile userProfile = new UserProfile();
        userProfile.setProfileTitle("No title given");
        User user = new User(email, username, firstName, lastName);
        this.userService.create(user);
        userProfile.setUser(user);
        UserProfile userProfileEntity = userProfileService.create(userProfile);
        // add custom attribute
        UserRepresentation userRepresentation = this.keycloakProviderService.createUser(username, password, email, firstName,
                lastName, true, roles, userProfileEntity.getProfileSlugUrl());
        log.info(LOG_CREATE_DEFAULT_USER_MSG, username, password);
    }

}
