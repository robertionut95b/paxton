package com.irb.paxton.core.process.resolver;

import com.irb.paxton.core.process.Process;
import com.irb.paxton.core.process.ProcessService;
import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SearchRequest;
import graphql.kickstart.tools.GraphQLQueryResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class ProcessQueryResolver implements GraphQLQueryResolver {
    @Autowired
    private ProcessService processService;

    public PaginatedResponse<Process> getAllProcesses(SearchRequest searchRequest) {
        return this.processService.getAllProcesses(searchRequest);
    }
}
