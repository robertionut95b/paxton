package com.irb.paxton.core.process.resolver;

import com.irb.paxton.core.process.Process;
import com.irb.paxton.core.process.ProcessService;
import com.irb.paxton.core.process.input.ProcessInput;
import com.irb.paxton.core.process.input.ProcessInputLkp;
import com.irb.paxton.core.process.input.ProcessInputUpdate;
import graphql.kickstart.tools.GraphQLMutationResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class ProcessMutationResolver implements GraphQLMutationResolver {

    @Autowired
    private ProcessService processService;

    public Process createProcess(ProcessInput processInput) {
        return this.processService.createProcess(processInput);
    }

    public Process updateProcess(ProcessInputUpdate processInputUpdate) {
        return this.processService.updateProcess(processInputUpdate);
    }

    public Process CreateProcess(ProcessInputLkp processInputLkp) {
        return this.processService.createProcess(processInputLkp);
    }
}
