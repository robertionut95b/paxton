package com.irb.paxton.core.candidate;

import com.irb.paxton.core.candidate.exception.ApplicationNotFoundException;
import com.irb.paxton.core.candidate.input.ApplicationInput;
import com.irb.paxton.core.candidate.mapper.ApplicationMapper;
import com.irb.paxton.core.candidate.projection.ApplicationsCountByStep;
import com.irb.paxton.core.messaging.Chat;
import com.irb.paxton.core.messaging.ChatService;
import com.irb.paxton.core.messaging.input.MessageInput;
import com.irb.paxton.core.process.Process;
import com.irb.paxton.core.process.ProcessSteps;
import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SearchRequest;
import com.irb.paxton.core.search.SearchSpecification;
import com.irb.paxton.security.auth.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PostFilter;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Collection;

@Service
public class ApplicationService {

    private static final String APPLICATION_NOT_FOUND_BY_ID = "Application by id %s does not exist";

    @Autowired
    UserRepository userRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private ApplicationMapper applicationMapper;

    @Autowired
    private ChatService chatService;

    @PostAuthorize("(hasRole('ROLE_RECRUITER') and @paxtonSecurityService.isOrganizationRecruiter(authentication, returnObject.jobListing.organization)) or hasRole('ROLE_ADMINISTRATOR') or @paxtonSecurityService.isOwner(authentication, returnObject.candidate.user.username)")
    public Application findById(Long applicationId) {
        return applicationRepository
                .findById(applicationId)
                .orElseThrow(() -> new ApplicationNotFoundException(APPLICATION_NOT_FOUND_BY_ID.formatted(applicationId)));
    }

    @PreAuthorize("!hasRole('ROLE_RECRUITER') or !hasRole('ROLE_ADMINISTRATOR')")
    @PostAuthorize("!@paxtonSecurityService.isOrganizationRecruiter(authentication, returnObject.jobListing.organization)")
    @Transactional
    public Application applyToJobListing(ApplicationInput applicationInput) {
        Application application = applicationMapper.inputToApplication(applicationInput);
        application.getProcessSteps().forEach(ps -> ps.setApplication(application));
        applicationRepository.save(application);
        return application;
    }

    @PreAuthorize("hasRole('ROLE_RECRUITER') or hasRole('ROLE_ADMINISTRATOR')")
    @PostAuthorize("@paxtonSecurityService.isOrganizationRecruiter(authentication, returnObject)")
    public PaginatedResponse<Application> getAllApplications(SearchRequest searchRequest) {
        if (searchRequest == null) searchRequest = new SearchRequest();
        SearchSpecification<Application> applicationSearchSpecification = new SearchSpecification<>(searchRequest);
        Pageable pageable = SearchSpecification.getPageable(searchRequest.getPage(), searchRequest.getSize());
        Page<Application> results = this.applicationRepository.findAll(applicationSearchSpecification, pageable);
        return new PaginatedResponse<>(
                results,
                searchRequest.getPage(),
                results.getTotalPages(),
                results.getTotalElements()
        );
    }

    @PostFilter("hasRole('ROLE_RECRUITER') or hasRole('ROLE_ADMINISTRATOR') or filterObject.createdBy == principal.username")
    public Collection<Application> getApplicationsForUserId(Long userId) {
        return applicationRepository.findByCandidate_User_Id(userId);
    }

    @PostAuthorize("(hasRole('ROLE_RECRUITER') and @paxtonSecurityService.isOrganizationRecruiter(authentication, returnObject.jobListing.organization)) or hasRole('ROLE_ADMINISTRATOR') or returnObject.createdBy == principal.username")
    public Application findByApplicationId(Long applicationId) {
        return applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ApplicationNotFoundException(APPLICATION_NOT_FOUND_BY_ID.formatted(applicationId), "applicationId"));
    }

    @PostAuthorize("(hasRole('ROLE_RECRUITER') and @paxtonSecurityService.isOrganizationRecruiter(authentication, returnObject.jobListing.organization)) or hasRole('ROLE_ADMINISTRATOR') or returnObject.createdBy == principal.username")
    public Application findByJobListingIdAndCandidateUsername(Long jobListingId, String username) {
        return applicationRepository.findByJobListingIdAndCandidate_UserUsername(jobListingId, username)
                .orElseThrow(() -> new ApplicationNotFoundException("Application for job id %s and candidate name %s does not exist".formatted(jobListingId, username), "jobListingId"));
    }

    @PreAuthorize("hasRole('ROLE_RECRUITER')")
    @PostAuthorize("@paxtonSecurityService.isOrganizationRecruiter(authentication, returnObject.jobListing.organization)")
    @Transactional
    public Application updateApplication(ApplicationInput applicationInput) {
        Application application = applicationRepository.findById(applicationInput.getId())
                .orElseThrow(() -> new ApplicationNotFoundException(APPLICATION_NOT_FOUND_BY_ID.formatted(applicationInput.getId()), "id"));
        application = applicationMapper.partialUpdate(applicationInput, application);
        // change status if there are no more steps to process
        Collection<ApplicationProcessSteps> applicationProcessSteps = application.getProcessSteps();
        var processStep = applicationProcessSteps.stream().findFirst();
        if (processStep.isPresent()) {
            Process orgProcess = processStep.get().getProcessStep().getProcess();
            Collection<ProcessSteps> appProcessSteps = applicationProcessSteps.stream().map(ApplicationProcessSteps::getProcessStep).toList();

            if (!appProcessSteps.containsAll(orgProcess.getProcessSteps()) && application.getStatus().equals(ApplicationStatus.FINISHED)) {
                throw new IllegalStateException("Application cannot have finished state before registering all process steps");
            }

            if (appProcessSteps.containsAll(orgProcess.getProcessSteps())) {
                application.setStatus(ApplicationStatus.FINISHED);
            }
        }
        applicationRepository.save(application);
        return application;
    }

    @PreAuthorize("hasRole('ROLE_RECRUITER')")
    public Collection<ApplicationsCountByStep> getApplicationsForJobIdCountBySteps(Long jobId) {
        return applicationRepository.getApplicationsForJobIdCountBySteps(jobId);
    }

    @Transactional
    @PostAuthorize("hasRole('ROLE_ADMINISTRATOR') or (hasRole('ROLE_RECRUITER') and @paxtonSecurityService.isOrganizationRecruiter(authentication, returnObject.jobListing.organization)) or returnObject.createdBy == principal.username")
    public Application addMessageToApplicationChat(MessageInput messageInput, Long applicationId) {
        Application application = this.findByApplicationId(applicationId);
        Chat applicationChat = chatService.addMessageToChat(messageInput);
        application.setChat(applicationChat);
        applicationRepository.save(application);
        return application;
    }
}
