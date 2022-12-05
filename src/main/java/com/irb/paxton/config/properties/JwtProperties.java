package com.irb.paxton.config.properties;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.NotBlank;

@Configuration
@ConfigurationProperties(prefix = "px.security.auth.jwt")
@Getter
@Setter
@Validated
public class JwtProperties {

    private Long accessTokenExpiryInSeconds = 900L;

    private String jwtRefreshCookieName = "pxRefresh";

    private Long refreshTokenExpiryInSeconds = 3600L;

    private Long refreshTokenExpiryRememberInSeconds = 2592000L;

    @NotBlank
    @Length(min = 52, max = 126)
    private String secret;

}
