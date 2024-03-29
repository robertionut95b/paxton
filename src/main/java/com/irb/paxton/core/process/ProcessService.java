package com.irb.paxton.core.process;

import com.irb.paxton.core.candidate.Application;
import com.irb.paxton.core.candidate.ApplicationProcessSteps;
import com.irb.paxton.core.candidate.ApplicationProcessStepsRepository;
import com.irb.paxton.core.candidate.ApplicationRepository;
import com.irb.paxton.core.model.AbstractRepository;
import com.irb.paxton.core.model.AbstractService;
import com.irb.paxton.core.organization.Organization;
import com.irb.paxton.core.organization.OrganizationRepository;
import com.irb.paxton.core.organization.exception.OrganizationNotFoundException;
import com.irb.paxton.core.process.exception.ProcessNotFoundException;
import com.irb.paxton.core.process.input.ProcessInput;
import com.irb.paxton.core.process.input.ProcessInputCreate;
import com.irb.paxton.core.process.mapper.ProcessMapper;
import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SearchRequest;
import jakarta.transaction.Transactional;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import static com.irb.paxton.config.properties.ApplicationProperties.DEFAULT_PROCESS_NAME;

@Service
public class ProcessService extends AbstractService<Process> {

    private final ProcessRepository processRepository;

    private final ProcessMapper processMapper;

    private final OrganizationRepository organizationRepository;

    private final ApplicationRepository applicationRepository;

    private final ApplicationProcessStepsRepository applicationProcessStepsRepository;

    protected ProcessService(AbstractRepository<Process> repository, ProcessRepository processRepository, ProcessMapper processMapper, OrganizationRepository organizationRepository, ApplicationRepository applicationRepository, ApplicationProcessStepsRepository applicationProcessStepsRepository) {
        super(repository);
        this.processRepository = processRepository;
        this.processMapper = processMapper;
        this.organizationRepository = organizationRepository;
        this.applicationRepository = applicationRepository;
        this.applicationProcessStepsRepository = applicationProcessStepsRepository;
    }

    @PreAuthorize("hasRole('ROLE_RECRUITER') or hasRole('ROLE_ADMINISTRATOR')")
    public PaginatedResponse<Process> getAllProcesses(SearchRequest searchRequest) {
        return super.advSearch(searchRequest);
    }

    @Transactional
    @PreAuthorize("hasRole('ROLE_RECRUITER') or hasRole('ROLE_ADMINISTRATOR')")
    public Process createProcess(ProcessInput processInput) {
        Process process = processMapper.inputToProcess(processInput);
        return super.create(process);
    }

    @Transactional
    @PreAuthorize("hasRole('ROLE_RECRUITER') or hasRole('ROLE_ADMINISTRATOR')")
    public Process updateProcess(ProcessInput processInputUpdate) {
        Process process = this.findById(processInputUpdate.getId());
        Process updatedProcess = processMapper.inputToProcessUpdate(process, processInputUpdate);
        return this.update(updatedProcess);
    }

    @Transactional
    @PreAuthorize("(hasRole('ROLE_RECRUITER') and @organizationSecurityService.isOrganizationRecruiter(authentication, #organizationId)) or hasRole('ROLE_ADMINISTRATOR')")
    public Process updateProcessForOrganizationId(ProcessInputCreate processInputCreate, Long organizationId) {
        Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new OrganizationNotFoundException("Organization by id [%s] does not exist".formatted(organizationId)));
        Process currentProcess = organization.getRecruitmentProcess();
        Process updatedProcess = processMapper.inputCreateToProcess(processInputCreate);
        // create new cloned instance of the process
        updatedProcess.getProcessSteps().forEach(ps -> ps.setProcess(updatedProcess));
        // for each application in the process, reset it to the starting step of it's process
        Optional<ProcessSteps> firstStepOpt = updatedProcess.getProcessSteps().stream().filter(ps -> ps.getOrder() == 1).findFirst();
        if (firstStepOpt.isPresent()) {
            ProcessSteps firstStep = firstStepOpt.get();
            List<Application> affectedApplications = currentProcess.getProcessSteps()
                    .stream()
                    .map(ProcessSteps::getApplications)
                    .flatMap(Collection::stream)
                    .map(ApplicationProcessSteps::getApplication)
                    .toList();
            affectedApplications.forEach(a -> {
                ApplicationProcessSteps currentStep = new ApplicationProcessSteps(firstStep, a, OffsetDateTime.now());
                applicationProcessStepsRepository.persist(currentStep);
                a.removeAllProcessSteps();
                a.addProcessSteps(currentStep);
                a.setCurrentStep(currentStep.getProcessStep());
                applicationRepository.update(a);
            });
        } else
            throw new IllegalStateException("New process must have a starting/ending step with order [1], [n] respectively");
        processRepository.update(updatedProcess);
        // assign the new instance to org
        organization.setRecruitmentProcess(updatedProcess);
        organizationRepository.update(organization);
        return updatedProcess;
    }

    public void assignDefaultProcessToOrg(Organization organization) {
        Process process = this.processRepository
                .findByName(DEFAULT_PROCESS_NAME)
                .orElseThrow(() -> new ProcessNotFoundException("Process by name [%s] does not exist".formatted(DEFAULT_PROCESS_NAME)));
        organization.setRecruitmentProcess(process);
    }
}
