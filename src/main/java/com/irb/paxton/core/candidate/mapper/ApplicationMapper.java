package com.irb.paxton.core.candidate.mapper;

import com.irb.paxton.core.candidate.Application;
import com.irb.paxton.core.candidate.ApplicationProcessSteps;
import com.irb.paxton.core.candidate.Candidate;
import com.irb.paxton.core.candidate.CandidateRepository;
import com.irb.paxton.core.candidate.input.ApplicationInput;
import com.irb.paxton.core.jobs.JobListing;
import com.irb.paxton.core.jobs.JobListingRepository;
import com.irb.paxton.core.jobs.exception.JobNotExistsException;
import com.irb.paxton.core.model.mapper.ReferenceMapper;
import com.irb.paxton.core.process.ProcessSteps;
import com.irb.paxton.core.process.ProcessStepsRepository;
import com.irb.paxton.core.process.Status;
import com.irb.paxton.core.profile.UserProfile;
import com.irb.paxton.core.profile.UserProfileRepository;
import com.irb.paxton.core.profile.exception.UserProfileNotFoundException;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserRepository;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collection;
import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring",
        injectionStrategy = InjectionStrategy.CONSTRUCTOR, uses = {ApplicationProcessStepsMapper.class, ReferenceMapper.class})
public abstract class ApplicationMapper {

    @Autowired
    JobListingRepository jobListingRepository;

    @Autowired
    UserProfileRepository userProfileRepository;

    @Autowired
    CandidateRepository candidateRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ProcessStepsRepository processStepsRepository;

    @Mapping(target = "processSteps", source = "applicationInput", qualifiedByName = "mapProcessStep")
    @Mapping(target = "jobListing", source = "applicationInput.jobListingId")
    @Mapping(target = "candidate", source = "applicationInput.userId")
    @Mapping(target = "applicantProfile", source = "applicationInput.applicantProfileId")
    public abstract Application inputToApplication(ApplicationInput applicationInput);

    @Named("mapProcessStep")
    public Collection<ApplicationProcessSteps> mapProcessStep(ApplicationInput applicationInput) {
        JobListing jobListing = this.mapJobListing(applicationInput.getJobListingId());
        Collection<ProcessSteps> processSteps = jobListing.getOrganization().getRecruitmentProcess().getProcessSteps();
        ProcessSteps candidatureStep = null;
        try {
            candidatureStep = processSteps.stream().filter(p -> p.getOrder() == 1 && p.getStatus().equals(Status.ACTIVE)).toList().get(0);
        } catch (IndexOutOfBoundsException ex) {
            throw new IllegalStateException(String.format("There is no active starting step for the recruitment process of job posting %s", applicationInput.getJobListingId()));
        }
        return List.of(new ApplicationProcessSteps(candidatureStep));
    }

    @Mapping(target = "applicantProfile", source = "applicationInput.applicantProfileId")
    @Mapping(target = "jobListing", source = "applicationInput.jobListingId")
    @Mapping(target = "candidate", source = "applicationInput.userId")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    public abstract Application partialUpdate(ApplicationInput applicationInput, @MappingTarget Application application);

    public JobListing mapJobListing(Long jobListingId) {
        return jobListingRepository.findById(jobListingId)
                .orElseThrow(() -> new JobNotExistsException(String.format("Job listing by id %d does not exist", jobListingId), "jobListingId"));
    }

    public Candidate mapCandidate(Long userId) {
        return candidateRepository.findById(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new UserNotFoundException(String.format("User by id %d does not exist", userId)));
                    return new Candidate(user, null);
                });
    }

    public UserProfile mapUserProfile(Long userProfileId) {
        return userProfileRepository.findById(userProfileId)
                .orElseThrow(() -> new UserProfileNotFoundException(String.format("User profile by id %d does not exist", userProfileId), "applicantProfileId"));
    }
}
