package com.irb.paxton.repository;

import com.irb.paxton.core.jobs.Job;
import com.irb.paxton.core.jobs.JobListing;
import com.irb.paxton.core.jobs.JobRepository;
import com.irb.paxton.core.jobs.category.JobCategory;
import com.irb.paxton.core.jobs.category.JobCategoryRepository;
import com.irb.paxton.core.jobs.contract.ContractType;
import com.irb.paxton.core.organization.Organization;
import com.irb.paxton.core.organization.OrganizationRepository;
import com.irb.paxton.core.organization.Recruiter;
import com.irb.paxton.core.organization.RecruiterRepository;
import com.irb.paxton.core.process.Process;
import com.irb.paxton.core.process.*;
import com.irb.paxton.security.auth.privilege.Privilege;
import com.irb.paxton.security.auth.privilege.PrivilegeService;
import com.irb.paxton.security.auth.role.PaxtonRole;
import com.irb.paxton.security.auth.role.Role;
import com.irb.paxton.security.auth.role.RoleService;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserService;
import com.irb.paxton.security.auth.user.credentials.Credentials;
import com.irb.paxton.security.auth.user.credentials.CredentialsType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
@Slf4j
public class RepositoryBootEventService {

    @Autowired
    private RepositorySetupRepository setupRepository;
    @Autowired
    private RoleService roleService;
    @Autowired
    private PrivilegeService privilegeService;
    @Autowired
    private UserService userService;
    @Autowired
    private OrganizationRepository organizationRepository;
    @Autowired
    private JobCategoryRepository jobCategoryRepository;

    @Autowired
    private ProcessRepository processRepository;

    @Autowired
    private RecruiterRepository recruiterRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private StepRepository stepRepository;

    @Autowired
    private ProcessStepsRepository processStepsRepository;

    public void setupApplicationRepository() {
        RepositorySetup repositorySetupRecord = this.setupRepository.findByIsActive(true);

        if (repositorySetupRecord != null) {
            log.info("Repository available for Paxton app! Reading latest metadata");
            return;
        }

        log.info("Paxton app is building up, initiating repository start-up");

        // create privileges
        Privilege readAllPrivilege = this.privilegeService.createPrivilegeIfNotFound("READ_ALL_PRIVILEGE");
        Privilege writeAllPrivilege = this.privilegeService.createPrivilegeIfNotFound("WRITE_ALL_PRIVILEGE");
        List<Privilege> adminPrivileges = Arrays.asList(readAllPrivilege, writeAllPrivilege);
        this.roleService.createRoleIfNotFound(PaxtonRole.ROLE_ADMINISTRATOR.toString(), adminPrivileges);
        this.roleService.createRoleIfNotFound(PaxtonRole.ROLE_READ_ONLY.toString(), Collections.singletonList(readAllPrivilege));
        this.roleService.createRoleIfNotFound(PaxtonRole.ROLE_EVERYONE.toString(), null);

        // define roles
        Role adminRole = this.roleService.findByName(PaxtonRole.ROLE_ADMINISTRATOR.toString());
        Role userRole = this.roleService.findByName(PaxtonRole.ROLE_READ_ONLY.toString());

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        // create system user (root)
        User systemUser = new User(null, "SystemUser", "Paxton", LocalDate.now(), "paxton@paxton.com", "pxSystemUser", Collections.singletonList(adminRole), null, true);
        Credentials credentials = new Credentials(null, CredentialsType.PASSWORD, passwordEncoder.encode("paxton123"), true, LocalDate.now(), null);
        systemUser.setCredentials(credentials);
        userService.createUser(systemUser);

        // create base admin user
        User admin = new User(null, "admin", "admin", null, "admin@paxton.com", "admin", Collections.singletonList(adminRole), null, true);
        Credentials adminCredentials = new Credentials(null, CredentialsType.PASSWORD, passwordEncoder.encode("admin"), true, LocalDate.now(), null);
        admin.setCredentials(adminCredentials);
        userService.createUser(admin);

        // create read-only user
        User readOnly = new User(null, "readOnly", "readOnly", null, "readOnly@paxton.com", "readOnly", Collections.singletonList(userRole), null, true);
        Credentials userCredentials = new Credentials(null, CredentialsType.PASSWORD, passwordEncoder.encode("readOnly"), true, LocalDate.now(), null);
        readOnly.setCredentials(userCredentials);
        userService.createUser(readOnly);

        Organization paxtonOrg = new Organization(1L, "Paxton", "IT&C", "Bucharest, Ro", null, null);
        JobCategory itcJobCategory = new JobCategory(1L, "IT&C", null);

        this.setupRepository.save(new RepositorySetup(null, true, true, true));
        this.organizationRepository.save(paxtonOrg);
        this.jobCategoryRepository.save(itcJobCategory);

        // define a job and job listing for Paxton organisation
        Job softwareDeveloper = new Job(null, "Software Developer", "Developers are often natural problem solvers who possess strong analytical skills and the ability to think outside the box", null);
        this.jobRepository.save(softwareDeveloper);
        JobListing jobListingPaxtonSoftwareDev = new JobListing(null, "Java Software Developer", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eget fermentum tortor. Etiam imperdiet ligula sem, in bibendum ligula egestas vel. Integer ac mi ac est convallis feugiat. Suspendisse faucibus scelerisque risus, a pellentesque eros pretium nec. Cras condimentum ante eu varius tincidunt. Nam elementum a nulla vel commodo. Mauris suscipit euismod vestibulum. Integer ac vestibulum tellus. Mauris vulputate nec lectus nec consequat.\n" +
                "\n" +
                "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Pellentesque tristique, diam quis posuere tincidunt, lacus risus molestie turpis, vel porta nunc libero sit amet risus. Integer sollicitudin dui sed justo laoreet pellentesque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed porta vehicula augue. Etiam in placerat dolor. Vestibulum pharetra, mauris at volutpat auctor, diam felis tincidunt est, in commodo risus metus a tellus. Aenean a egestas odio.\n" +
                "\n" +
                "Morbi consectetur eu urna vel pellentesque. Etiam sodales egestas ante sed cursus. Duis ut lacinia lacus. Nunc a gravida sem, ac lobortis lectus. Cras ut efficitur ante. Mauris vel vulputate tellus. Duis a elementum libero, in condimentum metus. Nullam et dolor quam. Morbi finibus purus at libero aliquet ultricies. Phasellus tellus eros, sagittis ac orci non, sollicitudin efficitur metus. Quisque non accumsan ligula. Praesent suscipit nisl vel porttitor aliquam. Integer accumsan tellus eros, eget euismod nisi mollis eget. Donec nulla purus, dapibus in maximus finibus, vulputate ut libero. Nunc tellus quam, malesuada quis consectetur ac, blandit non tellus.Some job description as set by Paxton Inc", LocalDate.now(), LocalDate.of(5999, 1, 1), true, "Bucharest, Romania", 3, softwareDeveloper, ContractType.FULL_TIME, paxtonOrg, itcJobCategory, null, null);
        // Define a basic process as template
        Recruiter recruiter = new Recruiter(null, admin);
        this.recruiterRepository.save(recruiter);
        Process paxtonProcess = new Process(null, "Paxton recruitment process", "Default Paxton Inc. recruitment process which is applied to all candidates", null, recruiter, null);
        // define steps
        Step applyStep = new Step(null, "Candidature", "During this step, candidates will send their profile reference. If they draw the recruiter's attention, the next steps will follow");
        Step candidatureAnalysisStep = new Step(null, "Analysis", "During this step, the recruiter will analysis the candidature and request more information if needed");
        Step interviewStep = new Step(null, "Interviews", "During this step, the candidate will be requested to join a few HR and technical interviews to be evaluated by the target teams");
        Step responseStep = new Step(null, "Response", "During this step, the candidate will be informed if an offer is made of if his candidature is rejected");
        Step offerNegotiationStep = new Step(null, "Offer negotiation", "This step will go through the contract negotiation between the employees and the employer");
        Step conclusionStep = new Step(null, "Conclusion", "This is the final step of the process, which will end up with a reject or accept from the employee/employer");
        this.stepRepository.saveAll(List.of(applyStep, candidatureAnalysisStep, interviewStep, responseStep, offerNegotiationStep, conclusionStep));
        // link steps to process
        ProcessSteps processStepsApply = new ProcessSteps(null, paxtonProcess, applyStep, Status.FINISHED, 1);
        ProcessSteps processStepsAnalysis = new ProcessSteps(null, paxtonProcess, candidatureAnalysisStep, Status.FINISHED, 2);
        ProcessSteps processStepsInterview = new ProcessSteps(null, paxtonProcess, interviewStep, Status.FINISHED, 3);
        ProcessSteps processStepsResponse = new ProcessSteps(null, paxtonProcess, responseStep, Status.FINISHED, 4);
        ProcessSteps processStepsOfferNegotiation = new ProcessSteps(null, paxtonProcess, offerNegotiationStep, Status.FINISHED, 5);
        ProcessSteps processStepsConclusion = new ProcessSteps(null, paxtonProcess, conclusionStep, Status.FINISHED, 6);
        this.processStepsRepository.saveAll(List.of(processStepsApply, processStepsAnalysis, processStepsInterview, processStepsResponse, processStepsOfferNegotiation, processStepsConclusion));

        paxtonProcess.setProcessSteps(List.of(processStepsApply, processStepsAnalysis, processStepsInterview, processStepsResponse, processStepsOfferNegotiation, processStepsConclusion));
        paxtonProcess.setJobListings(List.of(jobListingPaxtonSoftwareDev));
        this.processRepository.save(paxtonProcess);

        log.info("Paxton app finished initializing repository, moving on ...");
    }
}
