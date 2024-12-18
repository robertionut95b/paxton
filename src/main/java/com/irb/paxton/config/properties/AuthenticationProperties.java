package com.irb.paxton.config.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "px.security.auth")
@Getter
@Setter
public class AuthenticationProperties {

    private String keycloakUrl = "http://localhost:8081";

    private String keycloakRealm = "Paxton";

    private String keycloakClientId = "px-ui";

    private String keycloakAdminUser = "px_admin";

    private String keycloakMasterClientId = "admin-cli";

    private String keycloakMasterRealm = "master";

    private String keycloakAdminPassword;
}