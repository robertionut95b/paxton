package com.irb.paxton.core.organization;

import com.irb.paxton.core.model.AbstractRepository;
import com.irb.paxton.core.model.AbstractService;
import com.irb.paxton.core.organization.exception.EmptyUsersListException;
import com.irb.paxton.core.organization.exception.OrganizationNotFoundException;
import com.irb.paxton.core.organization.exception.RecruiterAlreadyAssignedException;
import com.irb.paxton.core.organization.exception.RecruiterExistingJobsException;
import com.irb.paxton.core.organization.input.RecruiterInput;
import com.irb.paxton.core.organization.mapper.RecruiterMapper;
import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SearchRequest;
import com.irb.paxton.security.auth.role.PaxtonRole;
import com.irb.paxton.security.auth.role.Role;
import com.irb.paxton.security.auth.role.RoleRepository;
import com.irb.paxton.security.auth.user.UserService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;

@Service
@Slf4j
public class RecruiterService extends AbstractService<Recruiter> {

    private final RecruiterRepository recruiterRepository;

    private final RecruiterMapper recruiterMapper;

    private final OrganizationRepository organizationRepository;

    private final UserService userService;

    private final RoleRepository roleRepository;

    protected RecruiterService(AbstractRepository<Recruiter> repository, RecruiterRepository recruiterRepository, RecruiterMapper recruiterMapper, OrganizationRepository organizationRepository, UserService userService, RoleRepository roleRepository) {
        super(repository);
        this.recruiterRepository = recruiterRepository;
        this.recruiterMapper = recruiterMapper;
        this.organizationRepository = organizationRepository;
        this.userService = userService;
        this.roleRepository = roleRepository;
    }

    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    @Transactional
    public Collection<Recruiter> alterRecruitersInOrganization(List<RecruiterInput> recruiterInput, Long organizationId) {
        if (recruiterInput == null)
            throw new EmptyUsersListException("Empty input list of users provided");
        Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(
                        () -> new OrganizationNotFoundException("Organization by id %s does not exist".formatted(organizationId))
                );

        List<Recruiter> currentRecruiters = (List<Recruiter>) organization.getRecruiters();
        List<Recruiter> newRecruits = recruiterInput
                .stream()
                .map(ri -> organization.getRecruiterById(ri.getId()).orElse(recruiterMapper.toEntity(ri, organizationId)))
                .toList();

        Role recruiterRole = roleRepository
                .findByName(PaxtonRole.ROLE_RECRUITER.toString());

        for (Recruiter newRecruit : newRecruits) {
            // check if user is already assigned in an organization
            if (recruiterRepository.existsByUser_IdAndOrganization_IdNot(newRecruit.getUser().getId(), organizationId)) {
                throw new RecruiterAlreadyAssignedException("User [\"%s\"] is already assigned as recruiter in another organization"
                        .formatted(newRecruit.getUser().getDisplayName()));
            }
            // check if the user also has the Recruiter role
            boolean usrInRole = userService
                    .checkUserIsInRole(newRecruit.getUser().getUsername(), PaxtonRole.ROLE_RECRUITER.toString());
            if (!usrInRole) {
                Collection<Role> userRoles = newRecruit.getUser().getRoles();
                userRoles.add(recruiterRole);
                newRecruit.getUser().setRoles(userRoles);
            }
        }
        // check against the current list of users employed in organization
        currentRecruiters.removeAll(newRecruits);

        if (!currentRecruiters.isEmpty()) {
            currentRecruiters.forEach(dr -> {
                // check if removed recruiter has attached job listings
                if (organization.getJobs()
                        .stream()
                        .anyMatch(j -> j.getRecruiter().getUser().getId().equals(dr.getUser().getId()))) {
                    String message = "Recruiter \"%s\" has attached existing job listings, remove the references first"
                            .formatted(dr.getUser().getDisplayName());
                    throw new RecruiterExistingJobsException(message, "recruiterInput");
                }
                // remove user from RECRUITER_ROLE as it no longer needs it
                log.info("Removing user \"%s\" from RECRUITER_ROLE as it no longer needs it".formatted(dr.getUser().getDisplayName()));
                dr.getUser().removeRole(recruiterRole);
            });
        }
        organization.setRecruitersList(newRecruits);
        organizationRepository.persist(organization);

        return organization.getRecruiters();
    }

    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR') or (hasRole('ROLE_RECRUITER') and @organizationSecurityService.isOrganizationRecruiter(authentication, #organizationId))")
    public Collection<Recruiter> findByOrganizationId(Long organizationId) {
        return this.recruiterRepository.findByOrganizationId(organizationId);
    }


    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR') or (hasRole('ROLE_RECRUITER') and @organizationSecurityService.isOrganizationRecruiter(authentication, #organizationSlug))")
    public Collection<Recruiter> findByOrganizationSlugName(String organizationSlug) {
        return this.recruiterRepository.findByOrganizationSlugName(organizationSlug);
    }

    @PostAuthorize("hasRole('ROLE_ADMINISTRATOR') or (hasRole('ROLE_RECRUITER') and @organizationSecurityService.isOrganizationRecruiter(authentication, returnObject))")
    public PaginatedResponse<Recruiter> findRecruitersAdvSearch(SearchRequest searchRequest) {
        return this.advSearch(searchRequest);
    }
}
