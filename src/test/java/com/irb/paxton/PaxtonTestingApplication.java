package com.irb.paxton;

import jakarta.servlet.Filter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jackson.JacksonAutoConfiguration;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.context.annotation.Bean;
import org.springframework.orm.jpa.support.OpenEntityManagerInViewFilter;

@SpringBootApplication
@ImportAutoConfiguration(JacksonAutoConfiguration.class)
@ConfigurationPropertiesScan("com.irb.paxton.config")
public class PaxtonTestingApplication {

    public static void main(String[] args) {
        SpringApplication.run(PaxtonTestingApplication.class, args);
    }

    @Bean
    public Filter OpenFilter() {
        return new OpenEntityManagerInViewFilter();
    }
}
