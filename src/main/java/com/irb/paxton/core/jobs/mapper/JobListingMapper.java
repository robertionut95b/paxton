package com.irb.paxton.core.jobs.mapper;

import com.irb.paxton.core.jobs.Job;
import com.irb.paxton.core.jobs.JobListing;
import com.irb.paxton.core.jobs.JobService;
import com.irb.paxton.core.jobs.category.JobCategory;
import com.irb.paxton.core.jobs.category.JobCategoryRepository;
import com.irb.paxton.core.jobs.category.exception.JobCategoryNotExistsException;
import com.irb.paxton.core.jobs.exception.JobNotExistsException;
import com.irb.paxton.core.jobs.input.JobListingInput;
import com.irb.paxton.core.location.City;
import com.irb.paxton.core.location.CityRepository;
import com.irb.paxton.core.organization.Organization;
import com.irb.paxton.core.organization.OrganizationRepository;
import com.irb.paxton.core.organization.Recruiter;
import com.irb.paxton.core.organization.RecruiterRepository;
import com.irb.paxton.core.organization.exception.OrganizationNotExistsException;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class JobListingMapper {

    @Autowired
    private CityRepository cityRepository;

    @Autowired
    private JobService jobService;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private JobCategoryRepository jobCategoryRepository;

    @Autowired
    private RecruiterRepository recruiterRepository;

    @Mapping(target = "recruiter", source = "jobListingInput.recruiterId")
    @Mapping(target = "organization", source = "jobListingInput.organizationId")
    @Mapping(target = "job", source = "jobListingInput.jobId")
    @Mapping(target = "city", source = "jobListingInput.location")
    @Mapping(target = "category", source = "jobListingInput.categoryId")
    @Mapping(target = "process", ignore = true)
    @Mapping(target = "modifiedBy", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "applications", ignore = true)
    @Mapping(target = "active", ignore = true)
    public abstract JobListing inputToJobListing(JobListingInput jobListingInput);

    public Organization mapOrganization(Long organizationId) {
        return organizationRepository.findById(organizationId)
                .orElseThrow(() -> new OrganizationNotExistsException(String.format("Organization by id %d does not exist", organizationId), "organizationId"));
    }

    public JobCategory mapJobCategory(Long categoryId) {
        return jobCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new JobCategoryNotExistsException(String.format("Job Category by id %d does not exist", categoryId), "categoryId"));
    }

    public City mapCity(String location) {
        return cityRepository.findByName(location).orElseThrow(IllegalArgumentException::new);
    }

    public Job mapJob(Long jobId) {
        return jobService.findById(jobId)
                .orElseThrow(() -> new JobNotExistsException(String.format("Job by id %d does not exist", jobId), "jobId"));
    }

    public Recruiter mapRecruiter(Long recruiterId) {
        return recruiterRepository.findById(recruiterId)
                .orElseThrow(() -> new UserNotFoundException(String.format("User by id %d does not exist", recruiterId)));
    }
}
