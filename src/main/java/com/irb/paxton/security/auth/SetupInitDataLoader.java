package com.irb.paxton.security.auth;

import com.irb.paxton.repository.RepositoryBootEventService;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class SetupInitDataLoader implements ApplicationListener<ContextRefreshedEvent> {

    private final RepositoryBootEventService repositoryBootEventService;

    public SetupInitDataLoader(RepositoryBootEventService repositoryBootEventService) {
        this.repositoryBootEventService = repositoryBootEventService;
    }

    @Override
    @Transactional
    public void onApplicationEvent(@NotNull ContextRefreshedEvent event) {
        this.repositoryBootEventService.setupApplicationRepository();
    }
}
