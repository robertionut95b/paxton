package com.irb.paxton.security.auth;

import com.irb.paxton.security.auth.repository.RepositoryBootEventService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;

@Slf4j
@Component
public class SetupAuthDataLoader implements ApplicationListener<ContextRefreshedEvent> {

    @Autowired
    private RepositoryBootEventService repositoryBootEventService;

    @Override
    @Transactional
    public void onApplicationEvent(ContextRefreshedEvent event) {
        this.repositoryBootEventService.setupApplicationRepository();
    }
}
