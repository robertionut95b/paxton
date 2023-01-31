package com.irb.paxton.repository;

import com.irb.paxton.core.activity.ActivitySector;
import com.irb.paxton.core.activity.ActivitySectorRepository;
import com.irb.paxton.core.jobs.Job;
import com.irb.paxton.core.jobs.JobListing;
import com.irb.paxton.core.jobs.JobListingRepository;
import com.irb.paxton.core.jobs.JobRepository;
import com.irb.paxton.core.jobs.category.JobCategory;
import com.irb.paxton.core.jobs.category.JobCategoryRepository;
import com.irb.paxton.core.jobs.contract.ContractType;
import com.irb.paxton.core.jobs.worktype.WorkType;
import com.irb.paxton.core.location.City;
import com.irb.paxton.core.location.CityRepository;
import com.irb.paxton.core.location.Country;
import com.irb.paxton.core.location.CountryRepository;
import com.irb.paxton.core.organization.Organization;
import com.irb.paxton.core.organization.OrganizationRepository;
import com.irb.paxton.core.organization.Recruiter;
import com.irb.paxton.core.organization.RecruiterRepository;
import com.irb.paxton.core.process.Process;
import com.irb.paxton.core.process.*;
import com.irb.paxton.core.study.certification.Certification;
import com.irb.paxton.core.study.certification.CertificationRepository;
import com.irb.paxton.core.study.domain.Domain;
import com.irb.paxton.core.study.domain.DomainRepository;
import com.irb.paxton.core.study.institution.Institution;
import com.irb.paxton.core.study.institution.InstitutionRepository;
import com.irb.paxton.security.auth.privilege.Privilege;
import com.irb.paxton.security.auth.privilege.PrivilegeService;
import com.irb.paxton.security.auth.role.PaxtonRole;
import com.irb.paxton.security.auth.role.Role;
import com.irb.paxton.security.auth.role.RoleService;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserService;
import com.irb.paxton.security.auth.user.credentials.Credentials;
import com.irb.paxton.security.auth.user.credentials.CredentialsType;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

import static com.irb.paxton.config.properties.ApplicationProperties.DEFAULT_PROCESS_NAME;

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

    @Autowired
    private JobListingRepository jobListingRepository;

    @Autowired
    private CountryRepository countryRepository;

    @Autowired
    private CityRepository cityRepository;

    @Autowired
    private ActivitySectorRepository activitySectorRepository;

    @Autowired
    private DomainRepository domainRepository;

    @Autowired
    private CertificationRepository certificationRepository;

    @Autowired
    private InstitutionRepository institutionRepository;

    public void setupApplicationRepository() {
        RepositorySetup repositorySetupRecord = this.setupRepository.findByIsActive(true);

        if (repositorySetupRecord != null) {
            log.info("Repository available for Paxton app! Reading latest metadata");
            return;
        }

        log.info("Paxton app is building up, initiating repository start-up");
        log.info("Paxton : creating auth objects");

        this.setupUsersRolesRepository();
        this.setupNomenclaturesRepository();
        this.setupSampleOrganizationRepository();

        this.setupRepository.save(new RepositorySetup(true, true, true));
        log.info("Paxton app finished initializing repository, moving on ...");
    }

    public void setupUsersRolesRepository() {
        // create privileges
        Privilege readAllPrivilege = this.privilegeService.createPrivilegeIfNotFound("READ_ALL_PRIVILEGE");
        Privilege writeAllPrivilege = this.privilegeService.createPrivilegeIfNotFound("WRITE_ALL_PRIVILEGE");
        List<Privilege> adminPrivileges = Arrays.asList(readAllPrivilege, writeAllPrivilege);
        this.roleService.createRoleIfNotFound(PaxtonRole.ROLE_ADMINISTRATOR.toString(), adminPrivileges);
        this.roleService.createRoleIfNotFound(PaxtonRole.ROLE_EVERYONE.toString(), null);
        this.roleService.createRoleIfNotFound(PaxtonRole.ROLE_RECRUITER.toString(), null);

        // define roles
        Role adminRole = this.roleService.findByName(PaxtonRole.ROLE_ADMINISTRATOR.toString());
        Role everyOneRole = this.roleService.findByName(PaxtonRole.ROLE_EVERYONE.toString());
        Role recruiterRole = this.roleService.findByName(PaxtonRole.ROLE_RECRUITER.toString());

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        // create system user (root)
        User systemUser = new User(null, "SystemUser", "Paxton", LocalDate.now(), "paxton@paxton.com", "pxSystemUser", List.of(adminRole, everyOneRole), null, true);
        Credentials credentials = new Credentials(CredentialsType.PASSWORD, passwordEncoder.encode("paxton123"), true, LocalDate.now(), null);
        systemUser.setCredentials(credentials);
        userService.registerNewUser(systemUser);

        // create base admin user
        User admin = new User(null, "admin", "admin", null, "admin@paxton.com", "admin", List.of(adminRole, everyOneRole), null, true);
        Credentials adminCredentials = new Credentials(CredentialsType.PASSWORD, passwordEncoder.encode("admin"), true, LocalDate.now(), null);
        admin.setCredentials(adminCredentials);
        userService.registerNewUser(admin);

        // create read-only user
        User readOnly = new User(null, "readOnly", "readOnly", null, "readOnly@paxton.com", "readOnly", List.of(everyOneRole), null, true);
        Credentials userCredentials = new Credentials(CredentialsType.PASSWORD, passwordEncoder.encode("readOnly"), true, LocalDate.now(), null);
        readOnly.setCredentials(userCredentials);
        userService.registerNewUser(readOnly);

        // create recruiter user
        User recruiter = new User(null, "pxRecruiter", "pxRecruiter", null, "pxRecruiter@paxton.com", "pxRecruiter", List.of(recruiterRole, everyOneRole), null, true);
        Credentials recruiterCredentials = new Credentials(CredentialsType.PASSWORD, passwordEncoder.encode("pxRecruiter"), true, LocalDate.now(), null);
        recruiter.setCredentials(recruiterCredentials);
        userService.registerNewUser(recruiter);
    }

    public void setupSampleOrganizationRepository() {
        log.info("Paxton : creating organization objects");

        Organization paxtonOrg = new Organization("Paxton", "This is the default application organization, used for testing.", "IT&C", "Bucharest, Ro", null, "https://www.svgrepo.com/show/165262/briefcase.svg", null, null);
        JobCategory itcJobCategory = new JobCategory("Information Technology & Communications", null);
        JobCategory educationCategory = new JobCategory("Education", null);
        JobCategory healthcareCategory = new JobCategory("Healthcare", null);
        JobCategory lawCategory = new JobCategory("Law", null);
        ActivitySector itFinance = new ActivitySector("Information Technology & Finance");
        ActivitySector healthcare = new ActivitySector("Healthcare");
        ActivitySector education = new ActivitySector("Education");
        ActivitySector law = new ActivitySector("Law");
        this.organizationRepository.save(paxtonOrg);
        this.activitySectorRepository.saveAll(List.of(itFinance, healthcare, education, law));
        this.jobCategoryRepository.saveAll(List.of(itcJobCategory, educationCategory, healthcareCategory, lawCategory));

        // define a job and job listing for Paxton organisation
        Job softwareDeveloper = new Job("Software Developer", "Developers are often natural problem solvers who possess strong analytical skills and the ability to think outside the box", null);
        Job dataAnalyst = new Job("Data Analyst", "A data analyst is a person whose job is to gather and interpret data in order to solve a specific problem", null);
        Job projectManager = new Job("Project Manager", "Project managers have the responsibility of the planning, procurement and execution of a project, in any undertaking that has a defined scope, defined start and a defined finish; regardless of industry", null);
        this.jobRepository.saveAll(List.of(softwareDeveloper, dataAnalyst, projectManager));

        City Buc = this.cityRepository.findByName("Bucharest").orElseThrow(IllegalArgumentException::new);
        User pxRecruiter = this.userService.findByUsername("pxRecruiter").orElseThrow(() -> new UserNotFoundException("pxRecruiter does not exist"));
        Recruiter recruiter = new Recruiter(pxRecruiter, paxtonOrg, true, null);

        JobListing jobListingPaxtonSoftwareDev = new JobListing("Java Software Developer", "Lorem ipsum dolor sit amet porttitor aliquam.", LocalDate.now(),
                LocalDate.of(2023, 3, 15), true, Buc, 3, softwareDeveloper, ContractType.FULL_TIME, paxtonOrg, itcJobCategory, null, recruiter, WorkType.HYBRID);

        softwareDeveloper.setJobListings(List.of(jobListingPaxtonSoftwareDev));
        jobListingRepository.save(jobListingPaxtonSoftwareDev);

        // Define a basic process as template
        this.recruiterRepository.save(recruiter);
        Process defaultProcess = new Process(DEFAULT_PROCESS_NAME, "Default recruitment process for all the organizations", null, null);

        // define steps
        Step applyStep = new Step(null, "Candidature", "During this step, candidates will send their profile reference. If they draw the recruiter's attention, the next steps will follow");
        Step candidatureAnalysisStep = new Step(null, "Analysis", "During this step, the recruiter will analysis the candidature and request more information if needed");
        Step interviewStep = new Step(null, "Interviews", "During this step, the candidate will be requested to join a few HR and technical interviews to be evaluated by the target teams");
        Step responseStep = new Step(null, "Response", "During this step, the candidate will be informed if an offer is made of if his candidature is rejected");
        Step offerNegotiationStep = new Step(null, "Offer negotiation", "This step will go through the contract negotiation between the employees and the employer");
        Step conclusionStep = new Step(null, "Conclusion", "This is the final step of the process, which will end up with a reject or accept from the employee/employer");
        this.stepRepository.saveAll(List.of(applyStep, candidatureAnalysisStep, interviewStep, responseStep, offerNegotiationStep, conclusionStep));
        // link steps to process
        ProcessSteps processStepsApply = new ProcessSteps(defaultProcess, applyStep, Status.ACTIVE, 1);
        ProcessSteps processStepsAnalysis = new ProcessSteps(defaultProcess, candidatureAnalysisStep, Status.ACTIVE, 2);
        ProcessSteps processStepsInterview = new ProcessSteps(defaultProcess, interviewStep, Status.ACTIVE, 3);
        ProcessSteps processStepsResponse = new ProcessSteps(defaultProcess, responseStep, Status.ACTIVE, 4);
        ProcessSteps processStepsOfferNegotiation = new ProcessSteps(defaultProcess, offerNegotiationStep, Status.ACTIVE, 5);
        ProcessSteps processStepsConclusion = new ProcessSteps(defaultProcess, conclusionStep, Status.ACTIVE, 6);
        this.processStepsRepository.saveAll(List.of(processStepsApply, processStepsAnalysis, processStepsInterview, processStepsResponse, processStepsOfferNegotiation, processStepsConclusion));

        defaultProcess.setProcessSteps(List.of(processStepsApply, processStepsAnalysis, processStepsInterview, processStepsResponse, processStepsOfferNegotiation, processStepsConclusion));
        this.processRepository.save(defaultProcess);
        paxtonOrg.setRecruitmentProcess(defaultProcess);
    }

    public void setupNomenclaturesRepository() {
        log.info("Paxton : creating location objects");

        City Buc = new City("Bucharest", null);
        City Cj = new City("Cluj", null);
        City Is = new City("Iasi", null);
        List<City> roCities = List.of(Buc, Cj, Is);
        Country Ro = new Country("RO", "Romania", new HashSet<>(roCities));
        roCities.forEach(c -> c.setCountry(Ro));

        City Berlin = new City("Berlin", null);
        City Stuttgart = new City("Stuttgart", null);
        List<City> grCities = List.of(Berlin, Stuttgart);
        Country Gr = new Country("GR", "Germany", new HashSet<>(grCities));
        grCities.forEach(c -> c.setCountry(Gr));

        City Rome = new City("Rome", null);
        City Napoli = new City("Napoli", null);
        List<City> itCities = List.of(Rome, Napoli);
        Country It = new Country("IT", "Italy", new HashSet<>(itCities));
        itCities.forEach(c -> c.setCountry(It));

        countryRepository.saveAll(List.of(Ro, Gr, It));

        // create institutions, domains and certifications
        log.info("Paxton : creating studies objects");

        Certification bachelorsDegree = new Certification("Bachelor's degree", null);
        Certification highSchoolDegree = new Certification("High school degree", null);
        certificationRepository.saveAll(List.of(bachelorsDegree, highSchoolDegree));

        Institution institutionCSIE = new Institution("Faculty of Cybernetics Statistics and Economic Informatics", "The Undergraduate Program in Economic Informatics ensures the training for: analysis, design and implementation of information systems in enterprises; utilization and configuration of software packages with application in economy; development and introduction of the applied software; research and application of the new computer science technologies; computer programming skills.", "https://csie.ase.ro/wp-content/uploads/2020/10/cropped-CSIE_new-300x132.png", null);
        Institution institutionASE = new Institution("Bucharest University of economic studies", "ASE is the Leader of economic and public administration higher education in Romania and South-Eastern Europe, as confirmed by its key positioning in prestigious international rankings.", "https://upload.wikimedia.org/wikipedia/ro/a/a3/Logo_ASE.png", null);
        institutionRepository.saveAll(List.of(institutionASE, institutionCSIE));

        Domain computerScience = new Domain("Computers Science", null);
        Domain economics = new Domain("Economics", null);
        Domain mathematics = new Domain("Mathematics", null);
        Domain statistics = new Domain("Statistics", null);
        Domain agriculture = new Domain("Agriculture", null);
        domainRepository.saveAll(List.of(computerScience, economics, mathematics, statistics, agriculture));
    }
}
