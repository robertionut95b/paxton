package com.irb.paxton.core.jobs;

import com.irb.paxton.core.jobs.category.JobCategoryRepository;
import com.irb.paxton.core.jobs.dto.JobDto;
import com.irb.paxton.core.jobs.exception.JobAlreadyExistsException;
import com.irb.paxton.core.jobs.input.JobInput;
import com.irb.paxton.core.organization.OrganizationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private JobCategoryRepository jobCategoryRepository;

    public Job publishJob(JobDto jobDto) {
        Job job = new Job(null, jobDto.getName(), jobDto.getDescription(), null);
        Optional<Job> jobOptional = jobRepository.findByName(jobDto.getName());
        if (jobOptional.isPresent()) {
            throw new JobAlreadyExistsException("Job already is already defined", "name");
        }
        jobRepository.save(job);
        return job;
    }

    public Job publishJob(JobInput jobInput) {
        Job job = new Job(null, jobInput.getName(), jobInput.getDescription(), null);
        Optional<Job> jobOptional = jobRepository.findByName(jobInput.getName());
        if (jobOptional.isPresent()) {
            throw new JobAlreadyExistsException("Job already is already defined", "name");
        }
        jobRepository.save(job);
        return job;
    }
}
