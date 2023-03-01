package com.irb.paxton.core.jobs.category;

import com.irb.paxton.core.jobs.category.exception.JobCategoryDuplicateException;
import com.irb.paxton.core.jobs.category.exception.JobCategoryNotExistsException;
import com.irb.paxton.core.jobs.category.input.JobCategoryInput;
import com.irb.paxton.core.jobs.category.mapper.JobCategoryMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class JobCategoryService {

    @Autowired
    private JobCategoryRepository jobCategoryRepository;

    @Autowired
    private JobCategoryMapper jobCategoryMapper;

    public JobCategory addJobCategory(JobCategoryInput jobCategoryInput) {
        JobCategory jobCategory;
        if (jobCategoryInput.getId() != null) {
            jobCategory = jobCategoryRepository.findById(jobCategoryInput.getId())
                    .orElseThrow(() -> new JobCategoryNotExistsException("Job category by id %s does not exist".formatted(jobCategoryInput.getId()), "id"));
            jobCategoryMapper.partialUpdate(jobCategoryInput, jobCategory);
        } else {
            Optional<JobCategory> jobCategoryOptional = jobCategoryRepository.findByName(jobCategoryInput.getName());
            if (jobCategoryOptional.isPresent()) {
                throw new JobCategoryDuplicateException("Job category by name %s is already defined".formatted(jobCategoryInput.getName()), "name");
            }
            jobCategory = jobCategoryMapper.inputToJobCategory(jobCategoryInput);
        }
        jobCategoryRepository.save(jobCategory);
        return jobCategory;
    }
}
