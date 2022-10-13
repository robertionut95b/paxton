package com.irb.paxton.config;

import com.irb.paxton.security.audit.EntityAuditorAware;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EnableJpaAuditing
public class AuditConfiguration {

    @Bean
    public EntityAuditorAware auditorAware() {
        return new EntityAuditorAware();
    }
}
