package com.irb.paxton.security.auth.repository;

import com.irb.paxton.security.auth.privilege.Privilege;
import com.irb.paxton.security.auth.privilege.PrivilegeService;
import com.irb.paxton.security.auth.role.PaxtonRole;
import com.irb.paxton.security.auth.role.Role;
import com.irb.paxton.security.auth.role.RoleService;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserService;
import com.irb.paxton.security.auth.user.credentials.Credentials;
import com.irb.paxton.security.auth.user.credentials.CredentialsType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
@Slf4j
public class RepositoryBootEventService {

    @Autowired
    private RepositorySetupRepository setupRepository;
    @Autowired
    private RoleService roleService;
    @Autowired
    private PrivilegeService privilegeService;
    @Autowired
    private UserService userService;

    public void setupApplicationRepository() {
        RepositorySetup repositorySetupRecord = this.setupRepository.findByIsActive(true);

        if (repositorySetupRecord != null) {
            log.info("Repository available for Paxton app! Reading latest metadata");
            return;
        }

        log.info("Paxton app is building up, initiating repository start-up");

        // create privileges
        Privilege readAllPrivilege = this.privilegeService.createPrivilegeIfNotFound("READ_ALL_PRIVILEGE");
        Privilege writeAllPrivilege = this.privilegeService.createPrivilegeIfNotFound("WRITE_ALL_PRIVILEGE");
        List<Privilege> adminPrivileges = Arrays.asList(readAllPrivilege, writeAllPrivilege);
        this.roleService.createRoleIfNotFound(PaxtonRole.ROLE_ADMINISTRATOR.toString(), adminPrivileges);
        this.roleService.createRoleIfNotFound(PaxtonRole.ROLE_READ_ONLY.toString(), Collections.singletonList(readAllPrivilege));
        this.roleService.createRoleIfNotFound(PaxtonRole.ROLE_EVERYONE.toString(), null);

        // define roles
        Role adminRole = this.roleService.findByName(PaxtonRole.ROLE_ADMINISTRATOR.toString());
        Role userRole = this.roleService.findByName(PaxtonRole.ROLE_READ_ONLY.toString());

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        // create system user (root)
        User systemUser = new User(null, "SystemUser", "Paxton", LocalDate.now(), "paxton@paxton.com", "pxSystemUser", Collections.singletonList(adminRole), null);
        Credentials credentials = new Credentials(null, CredentialsType.PASSWORD, passwordEncoder.encode("paxton123"), true, LocalDate.now(), null);
        systemUser.setCredentials(credentials);
        userService.createUser(systemUser);

        // create base admin user
        User admin = new User(null, "admin", "admin", null, "admin@paxton.com", "admin", Collections.singletonList(adminRole), null);
        Credentials adminCredentials = new Credentials(null, CredentialsType.PASSWORD, passwordEncoder.encode("admin"), true, LocalDate.now(), null);
        admin.setCredentials(adminCredentials);
        userService.createUser(admin);

        // create read-only user
        User readOnly = new User(null, "readOnly", "readOnly", null, "readOnly@paxton.com", "readOnly", Collections.singletonList(userRole), null);
        Credentials userCredentials = new Credentials(null, CredentialsType.PASSWORD, passwordEncoder.encode("readOnly"), true, LocalDate.now(), null);
        readOnly.setCredentials(userCredentials);
        userService.createUser(readOnly);

        this.setupRepository.save(new RepositorySetup(null, true, true, true));

        log.info("Paxton app finished initializing repository, moving on ...");
    }
}
