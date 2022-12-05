package com.irb.paxton.config.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "px.app.ui")
@Getter
@Setter
public class FrontendProperties {

    private boolean sslEnabled = false;

    private String frontendUrl = "http://localhost:3000";
}
