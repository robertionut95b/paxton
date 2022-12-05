package com.irb.paxton.config.properties;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "px.security.cors")
@Getter
public class CorsProperties {

    @Value("#{'${px.security.cors.allowedOrigins:http://localhost:3000,https://localhost:3000}'.split(',')}")
    private List<String> allowedOrigins;
}
