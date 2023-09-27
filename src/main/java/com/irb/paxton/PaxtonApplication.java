package com.irb.paxton;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jackson.JacksonAutoConfiguration;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.context.annotation.Bean;
import org.springframework.orm.jpa.support.OpenEntityManagerInViewFilter;

import jakarta.servlet.Filter;

@SpringBootApplication
@ImportAutoConfiguration(JacksonAutoConfiguration.class)
@ConfigurationPropertiesScan("com.irb.paxton.config")
public class PaxtonApplication {

    public static void main(String[] args) {
        SpringApplication.run(PaxtonApplication.class, args);
    }

    @Bean
    public Filter OpenFilter() {
        return new OpenEntityManagerInViewFilter();
    }
}
