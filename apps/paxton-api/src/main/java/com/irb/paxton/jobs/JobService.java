package com.irb.paxton.jobs;

import com.irb.paxton.jobs.category.JobCategory;
import com.irb.paxton.jobs.category.JobCategoryRepository;
import com.irb.paxton.jobs.category.exception.JobCategoryNotFoundException;
import com.irb.paxton.jobs.dto.JobDto;
import com.irb.paxton.jobs.input.JobInput;
import com.irb.paxton.organization.Organization;
import com.irb.paxton.organization.OrganizationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private JobCategoryRepository jobCategoryRepository;

    public Job publishJobDescription(JobDto jobDto) {
        Job job = new Job(
                null, jobDto.getName(), jobDto.getDescription(),
                jobDto.getContractType(), jobDto.getOrganization(), jobDto.getCategory(), null
        );
        jobRepository.save(job);
        return job;
    }

    public Job publishJobDescription(JobInput jobInput) {
        Organization organization = organizationRepository.findById(jobInput.getOrganizationId())
                .orElseThrow(() -> new IllegalArgumentException("Organization by id " + jobInput.getOrganizationId() + " does not exist"));
        JobCategory jobCategory = jobCategoryRepository.findById(jobInput.getJobCategoryId())
                .orElseThrow(() -> new JobCategoryNotFoundException("Job category by id " + jobInput.getJobCategoryId() + " does not exist", "jobCategoryId"));
        Job job = new Job(
                null, jobInput.getName(), jobInput.getDescription(),
                jobInput.getContractType(), organization, jobCategory, null
        );
        jobRepository.save(job);
        return job;
    }
}
