package com.irb.paxton.security.auth;

import com.irb.paxton.config.properties.AuthenticationProperties;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.CreatedResponseUtil;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.ClientResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.ClientRepresentation;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class KeycloakProviderService {

    private final AuthenticationProperties authenticationProperties;

    private final Keycloak keycloak;

    public KeycloakProviderService(AuthenticationProperties authenticationProperties) {
        this.authenticationProperties = authenticationProperties;
        this.keycloak = KeycloakBuilder.builder()
                .serverUrl(authenticationProperties.getKeycloakUrl())
                .realm(authenticationProperties.getKeycloakMasterRealm())
                .clientId(authenticationProperties.getKeycloakMasterClientId())
                .username(this.authenticationProperties.getKeycloakAdminUser())
                .password(this.authenticationProperties.getKeycloakAdminPassword())
                .build();
        log.info("Successfully established connection to Keycloak instance {} on realm {}",
                authenticationProperties.getKeycloakUrl(), authenticationProperties.getKeycloakRealm());
    }

    public UserRepresentation createUser(String username,
                                         String password,
                                         String email,
                                         String firstName,
                                         String lastName,
                                         Boolean isEnabled,
                                         List<String> roles,
                                         String profileId) {
        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(password);

        UserRepresentation userRepresentation = new UserRepresentation();
        userRepresentation.setUsername(username);
        userRepresentation.setEmail(email);
        userRepresentation.setFirstName(firstName);
        userRepresentation.setLastName(lastName);
        userRepresentation.setEnabled(isEnabled);
        userRepresentation.setEmailVerified(isEnabled);
        userRepresentation.setCredentials(List.of(credential));
        userRepresentation.setClientRoles(Collections.singletonMap(authenticationProperties.getKeycloakClientId(), roles));
        this.setUserProfile(userRepresentation, profileId);

        var userResponse = this.keycloak
                .realm(authenticationProperties.getKeycloakRealm())
                .users()
                .create(userRepresentation);
        for(String role: roles) {
            this.addRoleToUser(CreatedResponseUtil.getCreatedId(userResponse), role);
        }

        return userRepresentation;
    }

    public void updateUser(UserRepresentation userRepresentation) {
        this.getUsersResource()
                .get(userRepresentation.getId())
                .update(userRepresentation);
    }

    private void addRoleToUser(String userId, String role) {
        UsersResource usersResource = this.getUsersResource();
        UserResource userResource = usersResource.get(userId);
        ClientRepresentation clientRepresentation = this.getCurrentAppClientRepresentation();
        ClientResource clientResource = this.getCurrentAppClientResource(clientRepresentation);
        //getting role
        RoleRepresentation roleRepresentation = clientResource.roles().list().stream().filter(element -> element.getName().equals(role)).toList().get(0);
        //assigning to user
        userResource.roles().clientLevel(clientRepresentation.getId()).add(Collections.singletonList(roleRepresentation));
    }

    public void addRoleToUserByUsername(String username, String role) {
        UsersResource usersResource = this.getUsersResource();
        UserResource userResource = usersResource.get(usersResource.searchByUsername(username, true).get(0).getId());
        ClientRepresentation clientRepresentation = this.getCurrentAppClientRepresentation();
        ClientResource clientResource = this.getCurrentAppClientResource(clientRepresentation);
        //getting role
        RoleRepresentation roleRepresentation = clientResource.roles().list().stream().filter(element -> element.getName().equals(role)).toList().get(0);
        //assigning to user
        userResource.roles().clientLevel(clientRepresentation.getId()).add(Collections.singletonList(roleRepresentation));
    }

    public Optional<UserRepresentation> getUser(String username) {
        return this.getUsersResource()
                .searchByUsername(username, true)
                .stream().findFirst();
    }

    public void removeUser(String username) {
        var user = this.getUser(username);
        if (user.isPresent()) {
            var userRepresentation = user.get();
            this.getUsersResource().delete(userRepresentation.getId());
        }
    }

    public void setUserProfile(UserRepresentation userRepresentation, String userProfileId) {
        userRepresentation.setAttributes(Collections.singletonMap("userProfile", List.of(userProfileId)));
    }

    public boolean checkUserByIdHasRole(String userId, String role) {
        UsersResource usersResource = this.getUsersResource();
        UserResource userResource = usersResource.get(userId);
        Optional<RoleRepresentation> roleOpt = userResource
                .roles()
                .clientLevel(authenticationProperties.getKeycloakClientId())
                .listAll()
                .stream()
                .filter(r -> r.getName().equals(role))
                .findFirst();
        return roleOpt.isPresent();
    }

    public boolean checkUserByUsernameHasRole(String username, String role) {
        UsersResource usersResource = this.getUsersResource();
        Optional<UserRepresentation> userRepresentationOptional = usersResource
                .searchByUsername(username, true)
                .stream()
                .findFirst();
        if (userRepresentationOptional.isPresent()) {
            UserRepresentation userRepresentation = userRepresentationOptional.get();
            Optional<String> roleOpt = userRepresentation
                    .getClientRoles()
                    .get(authenticationProperties.getKeycloakClientId())
                    .stream()
                    .filter(r -> r.equals(role))
                    .findFirst();
            return roleOpt.isPresent();
        }

        return false;
    }

    public void removeRoleFromUserByUsername(String username, String role) {
        UsersResource usersResource = this.getUsersResource();
        Optional<UserRepresentation> userRepresentationOptional = this.getUser(username);
        if (userRepresentationOptional.isPresent()) {
            UserRepresentation userRepresentation = userRepresentationOptional.get();
            Optional<String> roleOpt = userRepresentation
                    .getClientRoles()
                    .get(authenticationProperties.getKeycloakClientId())
                    .stream()
                    .filter(r -> r.equals(role))
                    .findFirst();
            if (roleOpt.isPresent()) {
                ClientRepresentation clientRepresentation = this.getCurrentAppClientRepresentation();
                ClientResource clientResource = this.getCurrentAppClientResource(clientRepresentation);
                RoleRepresentation roleRepresentation = clientResource.roles().list().stream().filter(element -> element.getName().equals(role)).toList().get(0);
                usersResource
                        .get(userRepresentation.getUsername())
                        .roles()
                        .clientLevel(authenticationProperties.getKeycloakClientId())
                        .remove(List.of(roleRepresentation));
            }
        }
    }

    private ClientResource getCurrentAppClientResource(ClientRepresentation clientRepresentation) {
        return keycloak
                .realm(authenticationProperties.getKeycloakRealm())
                .clients().get(clientRepresentation.getId());
    }

    private ClientRepresentation getCurrentAppClientRepresentation() {
        return keycloak
                .realm(authenticationProperties.getKeycloakRealm())
                .clients().findAll().stream().filter(client -> client.getClientId().equals(authenticationProperties.getKeycloakClientId()))
                .toList().get(0);
    }

    private UsersResource getUsersResource() {
        return keycloak
                .realm(authenticationProperties.getKeycloakRealm())
                .users();
    }
}
