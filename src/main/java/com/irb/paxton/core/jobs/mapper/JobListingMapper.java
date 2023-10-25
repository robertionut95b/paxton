package com.irb.paxton.core.jobs.mapper;

import com.irb.paxton.core.jobs.Job;
import com.irb.paxton.core.jobs.JobListing;
import com.irb.paxton.core.jobs.JobService;
import com.irb.paxton.core.jobs.category.JobCategory;
import com.irb.paxton.core.jobs.category.JobCategoryRepository;
import com.irb.paxton.core.jobs.category.exception.JobCategoryNotFoundException;
import com.irb.paxton.core.jobs.exception.JobNotFoundException;
import com.irb.paxton.core.jobs.input.JobListingInput;
import com.irb.paxton.core.location.City;
import com.irb.paxton.core.location.CityRepository;
import com.irb.paxton.core.model.mapper.ReferenceMapper;
import com.irb.paxton.core.organization.Organization;
import com.irb.paxton.core.organization.OrganizationRepository;
import com.irb.paxton.core.organization.Recruiter;
import com.irb.paxton.core.organization.RecruiterRepository;
import com.irb.paxton.core.organization.exception.OrganizationNotFoundException;
import com.irb.paxton.core.process.ProcessRepository;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, injectionStrategy = InjectionStrategy.CONSTRUCTOR, uses = {ReferenceMapper.class})
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

    @Autowired
    private ProcessRepository processRepository;

    @Mapping(target = "recruiter", source = "jobListingInput.recruiterId")
    @Mapping(target = "organization", source = "jobListingInput.organizationId")
    @Mapping(target = "job", source = "jobListingInput.jobId")
    @Mapping(target = "city", source = "jobListingInput.location")
    @Mapping(target = "category", source = "jobListingInput.categoryId")
    public abstract JobListing inputToJobListing(JobListingInput jobListingInput);

    public Organization mapOrganization(Long organizationId) {
        return organizationRepository.findById(organizationId)
                .orElseThrow(() -> new OrganizationNotFoundException("Organization by id %d does not exist".formatted(organizationId)));
    }

    public JobCategory mapJobCategory(Long categoryId) {
        return jobCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new JobCategoryNotFoundException("Job Category by id %d does not exist".formatted(categoryId)));
    }

    public City mapCity(String location) {
        return cityRepository.findByName(location).orElseThrow(IllegalArgumentException::new);
    }

    public Job mapJob(Long jobId) {
        return jobService.findById(jobId)
                .orElseThrow(() -> new JobNotFoundException("Job by id %d does not exist".formatted(jobId)));
    }

    public Recruiter mapRecruiter(Long recruiterId) {
        return recruiterRepository.findById(recruiterId)
                .orElseThrow(() -> new UserNotFoundException("User by id %d does not exist".formatted(recruiterId)));
    }
}
