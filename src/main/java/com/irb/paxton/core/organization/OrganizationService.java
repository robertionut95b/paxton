package com.irb.paxton.core.organization;

import com.irb.paxton.core.model.AbstractRepository;
import com.irb.paxton.core.model.AbstractService;
import com.irb.paxton.core.organization.exception.OrganizationNotFoundException;
import com.irb.paxton.core.organization.input.OrganizationInput;
import com.irb.paxton.core.organization.mapper.OrganizationMapper;
import com.irb.paxton.core.process.ProcessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

@Service
public class OrganizationService extends AbstractService<Organization, Long> {

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private OrganizationMapper organizationMapper;

    @Autowired
    private ProcessService processService;

    protected OrganizationService(AbstractRepository<Organization, Long> repository) {
        super(repository);
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
        organizationRepository.save(organization);
        return organization;
    }

    public Organization findBySlugName(String slugName) {
        return this.organizationRepository.findBySlugName(slugName)
                .orElseThrow(() -> new OrganizationNotFoundException("Organization %s does not exist".formatted(slugName)));
    }
}
