package com.irb.paxton.core.candidate.mapper;

import com.irb.paxton.core.candidate.Application;
import com.irb.paxton.core.candidate.Candidate;
import com.irb.paxton.core.candidate.CandidateRepository;
import com.irb.paxton.core.candidate.input.ApplicationInput;
import com.irb.paxton.core.jobs.JobListing;
import com.irb.paxton.core.jobs.JobListingRepository;
import com.irb.paxton.core.jobs.exception.JobNotExistsException;
import com.irb.paxton.core.profile.UserProfile;
import com.irb.paxton.core.profile.UserProfileRepository;
import com.irb.paxton.core.profile.exception.UserProfileNotFoundException;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserRepository;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class ApplicationMapper {

    @Autowired
    JobListingRepository jobListingRepository;

    @Autowired
    UserProfileRepository userProfileRepository;

    @Autowired
    CandidateRepository candidateRepository;

    @Autowired
    UserRepository userRepository;

    @Mapping(target = "modifiedBy", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "jobListing", source = "applicationInput.jobListingId")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dateOfApplication", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "candidate", source = "applicationInput.userId")
    @Mapping(target = "applicationDocuments", ignore = true)
    @Mapping(target = "applicantProfile", source = "applicationInput.applicantProfileId")
    public abstract Application inputToApplication(ApplicationInput applicationInput);

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
