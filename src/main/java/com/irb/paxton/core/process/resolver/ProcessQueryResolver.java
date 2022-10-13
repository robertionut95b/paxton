package com.irb.paxton.core.process.resolver;

import com.irb.paxton.core.process.Process;
import com.irb.paxton.core.process.ProcessRepository;
import graphql.kickstart.tools.GraphQLQueryResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class ProcessQueryResolver implements GraphQLQueryResolver {
    @Autowired
    private ProcessRepository processRepository;

    public List<Process> getAllProcesses() {
        return this.processRepository.findAll();
    }
}
