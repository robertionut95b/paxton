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
import java.util.Collections;
import java.util.HashSet;
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

        this.setupRepository.save(new RepositorySetup(null, true, true, true));
        log.info("Paxton app finished initializing repository, moving on ...");
    }

    public void setupUsersRolesRepository() {
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
        userService.registerNewUser(systemUser);

        // create base admin user
        User admin = new User(null, "admin", "admin", null, "admin@paxton.com", "admin", Collections.singletonList(adminRole), null, true);
        Credentials adminCredentials = new Credentials(null, CredentialsType.PASSWORD, passwordEncoder.encode("admin"), true, LocalDate.now(), null);
        admin.setCredentials(adminCredentials);
        userService.registerNewUser(admin);

        // create read-only user
        User readOnly = new User(null, "readOnly", "readOnly", null, "readOnly@paxton.com", "readOnly", Collections.singletonList(userRole), null, true);
        Credentials userCredentials = new Credentials(null, CredentialsType.PASSWORD, passwordEncoder.encode("readOnly"), true, LocalDate.now(), null);
        readOnly.setCredentials(userCredentials);
        userService.registerNewUser(readOnly);

        // create recruiter user
        User recruiter = new User(null, "pxRecruiter", "pxRecruiter", null, "pxRecruiter@paxton.com", "pxRecruiter", Collections.singletonList(userRole), null, true);
        Credentials recruiterCredentials = new Credentials(null, CredentialsType.PASSWORD, passwordEncoder.encode("pxRecruiter"), true, LocalDate.now(), null);
        recruiter.setCredentials(recruiterCredentials);
        userService.registerNewUser(recruiter);
    }

    public void setupSampleOrganizationRepository() {
        log.info("Paxton : creating organization objects");

        Organization paxtonOrg = new Organization(null, "Paxton", "IT&C", "Bucharest, Ro", null, "https://www.svgrepo.com/show/165262/briefcase.svg", null);
        JobCategory itcJobCategory = new JobCategory(null, "IT&C", null);
        ActivitySector itFinance = new ActivitySector(null, "IT & Finance");
        this.activitySectorRepository.save(itFinance);
        this.organizationRepository.save(paxtonOrg);
        this.jobCategoryRepository.save(itcJobCategory);

        // define a job and job listing for Paxton organisation
        Job softwareDeveloper = new Job(null, "Software Developer", "Developers are often natural problem solvers who possess strong analytical skills and the ability to think outside the box", null);
        this.jobRepository.save(softwareDeveloper);

        City Buc = this.cityRepository.findByName("Bucharest").orElseThrow(IllegalArgumentException::new);

        JobListing jobListingPaxtonSoftwareDev = new JobListing(null, "Java Software Developer", "Lorem ipsum dolor sit amet porttitor aliquam.", LocalDate.now(),
                LocalDate.of(2023, 3, 15), true, Buc, 3, softwareDeveloper, ContractType.FULL_TIME, paxtonOrg, itcJobCategory, null, null);

        softwareDeveloper.setJobListings(List.of(jobListingPaxtonSoftwareDev));
        jobListingRepository.save(jobListingPaxtonSoftwareDev);

        // Define a basic process as template
        User pxRecruiter = this.userService.findByUsername("pxRecruiter").orElseThrow(() -> new UserNotFoundException("pxRecruiter does not exist"));
        Recruiter recruiter = new Recruiter(null, pxRecruiter, paxtonOrg, true, null);
        this.recruiterRepository.save(recruiter);
        Process paxtonProcess = new Process(null, "Paxton recruitment process", "Default Paxton Inc. recruitment process which is applied to all candidates", null, recruiter, List.of(jobListingPaxtonSoftwareDev));

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
        this.processRepository.save(paxtonProcess);
        jobListingPaxtonSoftwareDev.setProcess(paxtonProcess);
    }

    public void setupNomenclaturesRepository() {
        log.info("Paxton : creating location objects");

        City Buc = new City(null, "Bucharest", null);
        City Cj = new City(null, "Cluj", null);
        City Is = new City(null, "Iasi", null);
        List<City> roCities = List.of(Buc, Cj, Is);
        Country Ro = new Country("RO", "Romania", new HashSet<>(roCities));
        roCities.forEach(c -> c.setCountry(Ro));

        City Berlin = new City(null, "Berlin", null);
        City Stuttgart = new City(null, "Stuttgart", null);
        List<City> grCities = List.of(Berlin, Stuttgart);
        Country Gr = new Country("GR", "Germany", new HashSet<>(grCities));
        grCities.forEach(c -> c.setCountry(Gr));

        City Rome = new City(null, "Rome", null);
        City Napoli = new City(null, "Napoli", null);
        List<City> itCities = List.of(Rome, Napoli);
        Country It = new Country("IT", "Italy", new HashSet<>(itCities));
        itCities.forEach(c -> c.setCountry(It));

        countryRepository.saveAll(List.of(Ro, Gr, It));

        // create institutions, domains and certifications
        log.info("Paxton : creating studies objects");

        Certification bachelorsDegree = new Certification(null, "Bachelor's degree", null);
        Certification highSchoolDegree = new Certification(null, "High school degree", null);
        certificationRepository.saveAll(List.of(bachelorsDegree, highSchoolDegree));

        Institution institutionCSIE = new Institution(null, "Faculty of Cybernetics Statistics and Economic Informatics", "The Undergraduate Program in Economic Informatics ensures the training for: analysis, design and implementation of information systems in enterprises; utilization and configuration of software packages with application in economy; development and introduction of the applied software; research and application of the new computer science technologies; computer programming skills.", "https://csie.ase.ro/wp-content/uploads/2020/10/cropped-CSIE_new-300x132.png", null);
        Institution institutionASE = new Institution(null, "Bucharest University of economic studies", "ASE is the Leader of economic and public administration higher education in Romania and South-Eastern Europe, as confirmed by its key positioning in prestigious international rankings.", "https://upload.wikimedia.org/wikipedia/ro/a/a3/Logo_ASE.png", null);
        institutionRepository.saveAll(List.of(institutionASE, institutionCSIE));

        Domain computerScience = new Domain(null, "Computers Science", null);
        Domain economics = new Domain(null, "Economics", null);
        Domain mathematics = new Domain(null, "Mathematics", null);
        Domain statistics = new Domain(null, "Statistics", null);
        Domain agriculture = new Domain(null, "Agriculture", null);
        domainRepository.saveAll(List.of(computerScience, economics, mathematics, statistics, agriculture));
    }
}
