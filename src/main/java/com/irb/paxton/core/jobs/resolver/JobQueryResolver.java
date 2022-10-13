package com.irb.paxton.core.jobs.resolver;

import com.irb.paxton.core.jobs.Job;
import com.irb.paxton.core.jobs.JobService;
import graphql.kickstart.tools.GraphQLQueryResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class JobQueryResolver implements GraphQLQueryResolver {

    @Autowired
    private JobService jobService;

    public List<Job> getAllJobs() {
        return this.jobService.findAllJobs();
    }
}
