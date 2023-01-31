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

    public static final String DEFAULT_PROCESS_NAME = "Default recruitment process";

    @Value("${server.port:8080}")
    private int serverPort;
}
