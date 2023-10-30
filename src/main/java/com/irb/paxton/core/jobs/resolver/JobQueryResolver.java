package com.irb.paxton.core.jobs.resolver;

import com.irb.paxton.core.jobs.Job;
import com.irb.paxton.core.jobs.JobService;
import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SearchRequest;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@DgsComponent
public class JobQueryResolver {

    @Autowired
    private JobService jobService;

    @DgsQuery
    public List<Job> getAllJobs() {
        return this.jobService.findAllJobs();
    }

    @DgsQuery
    public Job getJobById(@InputArgument Long jobId) {
        return this.jobService.findById(jobId);
    }

    @DgsQuery
    public PaginatedResponse<Job> getAllJobsPaginated(@InputArgument SearchRequest searchQuery) {
        return jobService.getAllJobsPaginatedFiltered(searchQuery);
    }
}
