package com.irb.paxton.core.process.resolver;

import com.irb.paxton.core.process.Process;
import com.irb.paxton.core.process.ProcessService;
import com.irb.paxton.core.process.input.ProcessInput;
import com.irb.paxton.core.process.input.ProcessInputCreate;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.InputArgument;

@DgsComponent
public class ProcessMutationResolver {

    private final ProcessService processService;

    public ProcessMutationResolver(ProcessService processService) {
        this.processService = processService;
    }

    @DgsMutation
    public Process createProcess(@InputArgument ProcessInput ProcessInput) {
        return this.processService.createProcess(ProcessInput);
    }

    @DgsMutation
    public Process updateProcess(@InputArgument ProcessInput ProcessInput) {
        return this.processService.updateProcess(ProcessInput);
    }

    @DgsMutation
    public Process updateProcessForOrganizationId(@InputArgument ProcessInputCreate processInput, @InputArgument Long organizationId) {
        return this.processService.updateProcessForOrganizationId(processInput, organizationId);
    }
}
