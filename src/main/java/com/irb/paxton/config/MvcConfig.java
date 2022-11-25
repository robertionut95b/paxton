package com.irb.paxton.config;

import org.jetbrains.annotations.NotNull;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import static com.irb.paxton.storage.FileStorageProperties.FILES_URL_MAPPING;
import static com.irb.paxton.storage.FileStorageProperties.USER_STORAGE_UPLOAD_PATH;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(@NotNull ResourceHandlerRegistry registry) {
        WebMvcConfigurer.super.addResourceHandlers(registry);
        registry
                .addResourceHandler("/" + FILES_URL_MAPPING + "/**")
                .addResourceLocations("file:" + USER_STORAGE_UPLOAD_PATH)
                .setCachePeriod(60);
    }
}
