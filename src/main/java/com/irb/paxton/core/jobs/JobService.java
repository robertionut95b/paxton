package com.irb.paxton.core.jobs;

import com.irb.paxton.core.jobs.category.JobCategoryRepository;
import com.irb.paxton.core.jobs.exception.JobAlreadyExistsException;
import com.irb.paxton.core.jobs.exception.JobNotFoundException;
import com.irb.paxton.core.jobs.input.JobInput;
import com.irb.paxton.core.jobs.mapper.JobMapper;
import com.irb.paxton.core.model.AbstractRepository;
import com.irb.paxton.core.model.AbstractService;
import com.irb.paxton.core.organization.OrganizationRepository;
import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SearchRequest;
import com.irb.paxton.core.search.SearchSpecification;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class JobService extends AbstractService<Job, Long> {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private JobCategoryRepository jobCategoryRepository;

    @Autowired
    private JobMapper jobMapper;

    protected JobService(AbstractRepository<Job, Long> repository) {
        super(repository);
    }

    public Job publishJob(JobInput jobInput) {
        Job job;
        if (jobInput.getId() != null) {
            job = this.jobRepository.findById(jobInput.getId())
                    .orElseThrow(() -> new JobNotFoundException("Job by id %d does not exist".formatted(jobInput.getId())));
            jobMapper.partialUpdate(jobInput, job);
        } else {
            Optional<Job> jobOptional = jobRepository.findByName(jobInput.getName());
            if (jobOptional.isPresent()) {
                throw new JobAlreadyExistsException("Job by name %s is already defined".formatted(jobInput.getName()));
            }
            job = jobMapper.toEntity(jobInput);
        }
        jobRepository.save(job);
        return job;
    }

    public List<Job> findAllJobs() {
        return this.jobRepository.findAll();
    }

    public Job findById(Long jobId) {
        return this.jobRepository.findById(jobId)
                .orElseThrow(() -> new JobNotFoundException("Job by id [%s] does not exist".formatted(jobId)));
    }

    public PaginatedResponse<Job> getAllJobsPaginatedFiltered(SearchRequest searchRequest) {
        if (searchRequest == null) searchRequest = new SearchRequest();
        SearchSpecification<Job> jobSearchSpecification = new SearchSpecification<>(searchRequest);
        Pageable pageable = SearchSpecification.getPageable(searchRequest.getPage(), searchRequest.getSize());
        Page<Job> results = this.jobRepository.findAll(jobSearchSpecification, pageable);
        return new PaginatedResponse<>(
                results,
                searchRequest.getPage(),
                results.getTotalPages(),
                results.getTotalElements()
        );
    }
}
