package com.irb.paxton.core.candidate;

import com.irb.paxton.core.candidate.input.ApplicationInput;
import com.irb.paxton.core.candidate.mapper.ApplicationMapper;
import com.irb.paxton.security.auth.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ApplicationService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    private ApplicationRepository applicationRepository;
    @Autowired
    private ApplicationMapper applicationMapper;

    public Application applyToJobListing(ApplicationInput applicationInput) {
        Application application = applicationMapper.inputToApplication(applicationInput);
        applicationRepository.save(application);
        return application;
    }
}
