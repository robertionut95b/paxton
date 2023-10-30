package com.irb.paxton.config.storage;

import io.minio.MinioClient;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "px.app.storage.minio-s3")
@Getter
@Setter
@Slf4j
public class MinioConfig {

    @Value("${enabled:false}")
    private boolean isEnabled;

    @Value("${url:default}")
    private String url;

    @Value("${access-key:default}")
    private String accessKey;

    @Value("${secret-key:default}")
    private String secretKey;

    @Bean(name = "minioClient")
    @ConditionalOnProperty(prefix = "px.app.storage.minio-s3", name = "enabled", havingValue = "true")
    public MinioClient minioClient() {
        try {
            MinioClient client = MinioClient.builder()
                    .endpoint(url)
                    .credentials(accessKey, secretKey)
                    .build();
            log.info("Initialized minio client with url {}", url);
            return client;
        } catch (Exception e) {
            throw new MinioConfigurationException(e);
        }
    }
}
