package com.irb.paxton.security.auth;

import com.irb.paxton.repository.RepositoryBootEventService;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;

@Slf4j
@Component
public class SetupInitDataLoader implements ApplicationListener<ContextRefreshedEvent> {

    @Autowired
    private RepositoryBootEventService repositoryBootEventService;

    @Override
    @Transactional
    public void onApplicationEvent(@NotNull ContextRefreshedEvent event) {
        this.repositoryBootEventService.setupApplicationRepository();
    }
}
