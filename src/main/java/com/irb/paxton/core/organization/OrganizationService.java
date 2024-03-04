package com.irb.paxton.core.organization;

import com.irb.paxton.core.model.AbstractRepository;
import com.irb.paxton.core.model.AbstractService;
import com.irb.paxton.core.organization.exception.OrganizationNotFoundException;
import com.irb.paxton.core.organization.input.OrganizationInput;
import com.irb.paxton.core.organization.mapper.OrganizationMapper;
import com.irb.paxton.core.process.ProcessService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class OrganizationService extends AbstractService<Organization> {

    private final OrganizationRepository organizationRepository;

    private final OrganizationMapper organizationMapper;

    private final ProcessService processService;

    protected OrganizationService(AbstractRepository<Organization> repository, OrganizationRepository organizationRepository, OrganizationMapper organizationMapper, ProcessService processService) {
        super(repository);
        this.organizationRepository = organizationRepository;
        this.organizationMapper = organizationMapper;
        this.processService = processService;
    }

    @Transactional
    public Organization createOrUpdateOrganization(OrganizationInput organizationInput) {
        Organization organization;
        if (organizationInput.getId() != null) {
            organization = this.organizationRepository
                    .findById(organizationInput.getId())
                    .orElseThrow(() -> new OrganizationNotFoundException("Organization by id %s does not exist".formatted(organizationInput.getId())));
            organizationMapper.updateOrganizationFromOrganizationInput(organizationInput, organization);
        } else {
            organization = organizationMapper.organizationInputToOrganization(organizationInput);
            processService.assignDefaultProcessToOrg(organization);
        }
        this.create(organization);
        return organization;
    }

    public Organization findBySlugName(String slugName) {
        return this.organizationRepository.findBySlugName(slugName)
                .orElseThrow(() -> new OrganizationNotFoundException("Organization %s does not exist".formatted(slugName)));
    }
}
