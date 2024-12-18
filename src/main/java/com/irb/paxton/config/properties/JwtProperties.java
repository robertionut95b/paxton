package com.irb.paxton.config.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

@Configuration
@ConfigurationProperties(prefix = "px.security.auth.jwt")
@Getter
@Setter
@Validated
public class JwtProperties {

    private String resourceId;

    private String principalAttribute;

    private String permissionsClaimName = "authorities";

    private String rolesClaimName = "roles";

    private String userProfileClaimName = "user_profile";

}
