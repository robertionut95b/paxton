package com.irb.paxton.core.jobs.category;

import com.irb.paxton.core.jobs.category.exception.JobCategoryAlreadyExistsException;
import com.irb.paxton.core.jobs.category.exception.JobCategoryNotFoundException;
import com.irb.paxton.core.jobs.category.input.JobCategoryInput;
import com.irb.paxton.core.jobs.category.mapper.JobCategoryMapper;
import com.irb.paxton.core.model.AbstractRepository;
import com.irb.paxton.core.model.AbstractService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class JobCategoryService extends AbstractService<JobCategory> {

    private final JobCategoryRepository jobCategoryRepository;

    private final JobCategoryMapper jobCategoryMapper;

    protected JobCategoryService(AbstractRepository<JobCategory> repository, JobCategoryRepository jobCategoryRepository, JobCategoryMapper jobCategoryMapper) {
        super(repository);
        this.jobCategoryRepository = jobCategoryRepository;
        this.jobCategoryMapper = jobCategoryMapper;
    }

    public JobCategory addJobCategory(JobCategoryInput jobCategoryInput) {
        JobCategory jobCategory;
        if (jobCategoryInput.getId() != null) {
            jobCategory = jobCategoryRepository.findById(jobCategoryInput.getId())
                    .orElseThrow(() -> new JobCategoryNotFoundException("Job category by id %s does not exist".formatted(jobCategoryInput.getId())));
            jobCategoryMapper.partialUpdate(jobCategoryInput, jobCategory);
        } else {
            Optional<JobCategory> jobCategoryOptional = jobCategoryRepository.findByName(jobCategoryInput.getName());
            if (jobCategoryOptional.isPresent()) {
                throw new JobCategoryAlreadyExistsException("Job category by name %s is already defined".formatted(jobCategoryInput.getName()));
            }
            jobCategory = jobCategoryMapper.inputToJobCategory(jobCategoryInput);
        }
        this.create(jobCategory);
        return jobCategory;
    }
}
