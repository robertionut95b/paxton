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
import com.irb.paxton.core.organization.*;
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
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.net.MalformedURLException;
import java.net.URL;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

import static com.irb.paxton.config.properties.ApplicationProperties.DEFAULT_PROCESS_NAME;

@Service
@Slf4j
public class RepositoryBootEventService {

    public static final String LOG_CREATE_DEFAULT_USER_MSG = "Registering default user {} with credentials value=\"{}\". Please note this down as it is automatically generated";

    private final RepositorySetupRepository setupRepository;

    private final RoleService roleService;

    private final PrivilegeService privilegeService;

    private final UserService userService;

    private final OrganizationRepository organizationRepository;

    private final JobCategoryRepository jobCategoryRepository;

    private final ProcessRepository processRepository;

    private final RecruiterRepository recruiterRepository;

    private final JobRepository jobRepository;

    private final StepRepository stepRepository;

    private final ProcessStepsRepository processStepsRepository;

    private final JobListingRepository jobListingRepository;

    private final CountryRepository countryRepository;

    private final CityRepository cityRepository;

    private final ActivitySectorRepository activitySectorRepository;

    private final DomainRepository domainRepository;

    private final CertificationRepository certificationRepository;

    private final InstitutionRepository institutionRepository;

    public RepositoryBootEventService(RepositorySetupRepository setupRepository, RoleService roleService, PrivilegeService privilegeService, UserService userService, OrganizationRepository organizationRepository, JobCategoryRepository jobCategoryRepository, ProcessRepository processRepository, RecruiterRepository recruiterRepository, JobRepository jobRepository, StepRepository stepRepository, ProcessStepsRepository processStepsRepository, JobListingRepository jobListingRepository, CountryRepository countryRepository, CityRepository cityRepository, ActivitySectorRepository activitySectorRepository, DomainRepository domainRepository, CertificationRepository certificationRepository, InstitutionRepository institutionRepository) {
        this.setupRepository = setupRepository;
        this.roleService = roleService;
        this.privilegeService = privilegeService;
        this.userService = userService;
        this.organizationRepository = organizationRepository;
        this.jobCategoryRepository = jobCategoryRepository;
        this.processRepository = processRepository;
        this.recruiterRepository = recruiterRepository;
        this.jobRepository = jobRepository;
        this.stepRepository = stepRepository;
        this.processStepsRepository = processStepsRepository;
        this.jobListingRepository = jobListingRepository;
        this.countryRepository = countryRepository;
        this.cityRepository = cityRepository;
        this.activitySectorRepository = activitySectorRepository;
        this.domainRepository = domainRepository;
        this.certificationRepository = certificationRepository;
        this.institutionRepository = institutionRepository;
    }

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

        this.setupRepository.persist(new RepositorySetup(true, true, true));
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
        String password = RandomStringUtils.random(32, true, true);
        User systemUser = new User("SystemUser", "Paxton", LocalDate.now(), "paxton@paxton.com", "pxSystemUser", List.of(adminRole, everyOneRole), null, true);
        Credentials credentials = new Credentials(CredentialsType.PASSWORD, passwordEncoder.encode(password), true, LocalDate.now(), null);
        log.info(LOG_CREATE_DEFAULT_USER_MSG, "pxSystemUser", password);
        systemUser.setCredentials(credentials);
        userService.registerNewUser(systemUser);

        // create base admin user
        password = RandomStringUtils.random(32, true, true);
        String adminStr = "admin";
        User admin = new User(adminStr, adminStr, null, "admin@paxton.com", adminStr, List.of(adminRole, everyOneRole), null, true);
        Credentials adminCredentials = new Credentials(CredentialsType.PASSWORD, passwordEncoder.encode(password), true, LocalDate.now(), null);
        log.info(LOG_CREATE_DEFAULT_USER_MSG, adminStr, password);
        admin.setCredentials(adminCredentials);
        userService.registerNewUser(admin);

        // create read-only user
        password = RandomStringUtils.random(32, true, true);
        String readOnlyStr = "readOnly";
        User readOnly = new User(readOnlyStr, readOnlyStr, null, "readOnly@paxton.com", readOnlyStr, List.of(everyOneRole), null, true);
        Credentials userCredentials = new Credentials(CredentialsType.PASSWORD, passwordEncoder.encode(password), true, LocalDate.now(), null);
        log.info(LOG_CREATE_DEFAULT_USER_MSG, readOnlyStr, password);
        readOnly.setCredentials(userCredentials);
        userService.registerNewUser(readOnly);

        // create recruiter user
        password = RandomStringUtils.random(32, true, true);
        String pxRecruiterStr = "pxRecruiter";
        User recruiter = new User(pxRecruiterStr, pxRecruiterStr, null, "pxRecruiter@paxton.com", pxRecruiterStr, List.of(recruiterRole, everyOneRole), null, true);
        Credentials recruiterCredentials = new Credentials(CredentialsType.PASSWORD, passwordEncoder.encode(password), true, LocalDate.now(), null);
        log.info(LOG_CREATE_DEFAULT_USER_MSG, pxRecruiterStr, password);
        recruiter.setCredentials(recruiterCredentials);
        userService.registerNewUser(recruiter);
    }

    public void setupSampleOrganizationRepository() {
        log.info("Paxton : creating organization objects");
        URL paxtonUrl = null;
        try {
            paxtonUrl = new URL("http://paxton.org");
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }

        ActivitySector itFinance = new ActivitySector("Information Technology & Finance");
        ActivitySector healthcare = new ActivitySector("Healthcare");
        ActivitySector education = new ActivitySector("Education");
        ActivitySector law = new ActivitySector("Law");
        City Buc = this.cityRepository.findByName("Bucharest").orElseThrow(IllegalArgumentException::new);

        Organization paxtonOrg = new Organization("Paxton", "paxton", "Find your perfect career with Paxton.", "Paxton is the perfect place to find your dream career. With our easy-to-use platform, you can search for jobs based on your skills and experience. We also have a wide range of resources to help you prepare for your job search. So what are you waiting for? Start your job search today", Buc, null, "https://media.discordapp.net/attachments/1073267180730327153/1073270545321304175/1960_letter_P_logo_flat_round_typography_simple_by_Steff_Geissb_c9a8a26b-7c20-441e-8373-c0ed652626e3.png?width=767&height=767", null, null, paxtonUrl, itFinance, LocalDate.of(2022, 10, 1), OrganizationSize.BETWEEN_1_5, null, List.of(Specialization.IT_and_Software, Specialization.AI, Specialization.Software_Development, Specialization.Software_Product_Design, Specialization.Project_Management), null);
        JobCategory itcJobCategory = new JobCategory("Information Technology & Communications", null);
        JobCategory educationCategory = new JobCategory("Education", null);
        JobCategory healthcareCategory = new JobCategory("Healthcare", null);
        JobCategory lawCategory = new JobCategory("Law", null);
        this.organizationRepository.persist(paxtonOrg);
        this.activitySectorRepository.persistAll(List.of(itFinance, healthcare, education, law));
        this.jobCategoryRepository.persistAll(List.of(itcJobCategory, educationCategory, healthcareCategory, lawCategory));

        // define a job and job listing for Paxton organisation
        Job softwareDeveloper = new Job("Software Developer", "Developers are often natural problem solvers who possess strong analytical skills and the ability to think outside the box", null);
        Job dataAnalyst = new Job("Data Analyst", "A data analyst is a person whose job is to gather and interpret data in order to solve a specific problem", null);
        Job projectManager = new Job("Project Manager", "Project managers have the responsibility of the planning, procurement and execution of a project, in any undertaking that has a defined scope, defined start and a defined finish; regardless of industry", null);
        this.jobRepository.persistAll(List.of(softwareDeveloper, dataAnalyst, projectManager));


        User pxRecruiter = this.userService.findByUsername("pxRecruiter").orElseThrow(() -> new UserNotFoundException("pxRecruiter does not exist"));
        Recruiter recruiter = new Recruiter(pxRecruiter, paxtonOrg, true, null);

        LocalDate now = LocalDate.now();
        now = now.plusMonths(1);
        now = now.plusDays(15);
        JobListing jobListingPaxtonSoftwareDev = new JobListing("Java Software Developer", "Lorem ipsum dolor sit amet porttitor aliquam.", "<h1><strong>About the job</strong></h1><p></p><h2><strong>Description</strong></h2><p>Lorem ipsum dolor sit amet porttitor aliquam</p>", LocalDate.now(),
                LocalDate.of(now.getYear(), now.getMonth(), now.getDayOfMonth()), true, Buc, 3, softwareDeveloper, ContractType.FULL_TIME, paxtonOrg, itcJobCategory, null, recruiter, WorkType.HYBRID);

        softwareDeveloper.setJobListings(List.of(jobListingPaxtonSoftwareDev));
        jobListingRepository.persist(jobListingPaxtonSoftwareDev);

        // Define a basic process as template
        this.recruiterRepository.persist(recruiter);
        Process defaultProcess = new Process(DEFAULT_PROCESS_NAME, "Default recruitment process for all the organizations", null, null);

        // define steps
        Step applyStep = new Step(null, "Candidature", "During this step, candidates will send their profile reference. If they draw the recruiter's attention, the next steps will follow");
        Step candidatureAnalysisStep = new Step(null, "Analysis", "During this step, the recruiter will analysis the candidature and request more information if needed");
        Step interviewStep = new Step(null, "Interviews", "During this step, the candidate will be requested to join a few HR and technical interviews to be evaluated by the target teams");
        Step responseStep = new Step(null, "Response", "During this step, the candidate will be informed if an offer is made of if his candidature is rejected");
        Step offerNegotiationStep = new Step(null, "Offer negotiation", "This step will go through the contract negotiation between the employees and the employer");
        Step conclusionStep = new Step(null, "Conclusion", "This is the final step of the process, which will end up with a reject or accept from the employee/employer");
        this.stepRepository.persistAll(List.of(applyStep, candidatureAnalysisStep, interviewStep, responseStep, offerNegotiationStep, conclusionStep));
        // link steps to process
        ProcessSteps processStepsApply = new ProcessSteps(defaultProcess, applyStep, Status.ACTIVE, 1);
        ProcessSteps processStepsAnalysis = new ProcessSteps(defaultProcess, candidatureAnalysisStep, Status.ACTIVE, 2);
        ProcessSteps processStepsInterview = new ProcessSteps(defaultProcess, interviewStep, Status.ACTIVE, 3);
        ProcessSteps processStepsResponse = new ProcessSteps(defaultProcess, responseStep, Status.ACTIVE, 4);
        ProcessSteps processStepsOfferNegotiation = new ProcessSteps(defaultProcess, offerNegotiationStep, Status.ACTIVE, 5);
        ProcessSteps processStepsConclusion = new ProcessSteps(defaultProcess, conclusionStep, Status.ACTIVE, 6);
        this.processStepsRepository.persistAll(List.of(processStepsApply, processStepsAnalysis, processStepsInterview, processStepsResponse, processStepsOfferNegotiation, processStepsConclusion));

        defaultProcess.setProcessSteps(List.of(processStepsApply, processStepsAnalysis, processStepsInterview, processStepsResponse, processStepsOfferNegotiation, processStepsConclusion));
        this.processRepository.persist(defaultProcess);
        paxtonOrg.setRecruitmentProcess(defaultProcess);
    }

    public void setupNomenclaturesRepository() {
        log.info("Paxton : creating location objects");

        City Buc = new City("Bucharest", null, 26.10626, 44.43225);
        City Cj = new City("Cluj", null, 23.6, 46.76667);
        City Is = new City("Iasi", null, 27.57, 47.17);
        List<City> roCities = List.of(Buc, Cj, Is);
        Country Ro = new Country("RO", "Romania", new HashSet<>(roCities));
        roCities.forEach(c -> c.setCountry(Ro));

        City Berlin = new City("Berlin", null, 13.25, 52.30);
        City Stuttgart = new City("Stuttgart", null, 9.18278, 48.7756);
        List<City> grCities = List.of(Berlin, Stuttgart);
        Country Gr = new Country("GR", "Germany", new HashSet<>(grCities));
        grCities.forEach(c -> c.setCountry(Gr));

        City Rome = new City("Rome", null, 12.4942, 41.8905);
        City Napoli = new City("Napoli", null, 14.2681244, 40.8517746);
        List<City> itCities = List.of(Rome, Napoli);
        Country It = new Country("IT", "Italy", new HashSet<>(itCities));
        itCities.forEach(c -> c.setCountry(It));

        countryRepository.persistAll(List.of(Ro, Gr, It));

        // create institutions, domains and certifications
        log.info("Paxton : creating studies objects");

        Certification bachelorsDegree = new Certification("Bachelor's degree", null);
        Certification highSchoolDegree = new Certification("High school degree", null);
        certificationRepository.persistAll(List.of(bachelorsDegree, highSchoolDegree));

        Institution institutionCSIE = new Institution("Faculty of Cybernetics Statistics and Economic Informatics", "The Undergraduate Program in Economic Informatics ensures the training for: analysis, design and implementation of information systems in enterprises; utilization and configuration of software packages with application in economy; development and introduction of the applied software; research and application of the new computer science technologies; computer programming skills.", "https://csie.ase.ro/wp-content/uploads/2020/10/cropped-CSIE_new-300x132.png", null);
        Institution institutionASE = new Institution("Bucharest University of economic studies", "ASE is the Leader of economic and public administration higher education in Romania and South-Eastern Europe, as confirmed by its key positioning in prestigious international rankings.", "https://upload.wikimedia.org/wikipedia/ro/a/a3/Logo_ASE.png", null);
        institutionRepository.persistAll(List.of(institutionASE, institutionCSIE));

        Domain computerScience = new Domain("Computers Science", null);
        Domain economics = new Domain("Economics", null);
        Domain mathematics = new Domain("Mathematics", null);
        Domain statistics = new Domain("Statistics", null);
        Domain agriculture = new Domain("Agriculture", null);
        domainRepository.persistAll(List.of(computerScience, economics, mathematics, statistics, agriculture));
    }
}
