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

    private String headerName = "Authorization";

    private String headerPrefix = "Bearer ";

}

