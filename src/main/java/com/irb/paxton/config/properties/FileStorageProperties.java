package com.irb.paxton.config.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties("px.app.storage")
@Getter
@Setter
public class FileStorageProperties {

    public final String storageRootPath = "storage";

    public final String storageUserPath = "user-uploads";

    public final String storageUserApplicationsPath = "applications";

}
