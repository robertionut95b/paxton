package com.irb.paxton.config.properties;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties
@Getter
public class ApplicationProperties {

    public static final String API_VERSION = "v1";

    public static final String TABLE_PREFIX = "PX";

    @Value("${server.port:8080}")
    private int serverPort;
}
