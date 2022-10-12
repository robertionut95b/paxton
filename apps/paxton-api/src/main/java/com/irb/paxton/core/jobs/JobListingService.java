package com.irb.paxton.core.jobs;

import com.irb.paxton.core.jobs.category.JobCategory;
import com.irb.paxton.core.jobs.category.JobCategoryRepository;
import com.irb.paxton.core.jobs.category.exception.JobCategoryNotExistsException;
import com.irb.paxton.core.jobs.exception.JobNotExistsException;
import com.irb.paxton.core.jobs.input.JobListingInput;
import com.irb.paxton.core.organization.Organization;
import com.irb.paxton.core.organization.OrganizationRepository;
import com.irb.paxton.core.organization.exception.OrganizationNotExistsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobListingService {

    @Autowired
    private JobListingRepository jobListingRepository;

    @Autowired
    private JobService jobService;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private JobCategoryRepository jobCategoryRepository;

    public List<JobListing> getAllJobListings() {
        return this.jobListingRepository.findAll();
    }

    public JobListing publishJobListing(JobListingInput jobListingInput) {

        Job job = jobService.findById(jobListingInput.getJobId())
                .orElseThrow(() -> new JobNotExistsException(String.format("Job by id %d does not exist", jobListingInput.getJobId()), "jobId"));
        Organization organization = organizationRepository.findById(jobListingInput.getOrganizationId())
                .orElseThrow(() -> new OrganizationNotExistsException(String.format("Organization by id %d does not exist", jobListingInput.getOrganizationId()), "organizationId"));
        JobCategory jobCategory = jobCategoryRepository.findById(jobListingInput.getCategoryId())
                .orElseThrow(() -> new JobCategoryNotExistsException(String.format("Job Category by id %d does not exist", jobListingInput.getCategoryId()), "categoryId"));

        JobListing jobListing = new JobListing(
                null, jobListingInput.getTitle(), jobListingInput.getDescription(), jobListingInput.getAvailableFrom(),
                jobListingInput.getAvailableTo(), false, jobListingInput.getLocation(), jobListingInput.getNumberOfVacancies(),
                job, jobListingInput.getContractType(), organization, jobCategory, null, null
        );
        jobListingRepository.save(jobListing);

        return jobListing;
    }
}
