package com.irb.paxton.core.process.resolver;

import com.irb.paxton.core.process.Process;
import com.irb.paxton.core.process.ProcessService;
import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SearchRequest;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;

@DgsComponent
public class ProcessQueryResolver {

    private final ProcessService processService;

    public ProcessQueryResolver(ProcessService processService) {
        this.processService = processService;
    }

    @DgsQuery
    public PaginatedResponse<Process> getAllProcesses(@InputArgument SearchRequest searchQuery) {
        return this.processService.getAllProcesses(searchQuery);
    }
}
