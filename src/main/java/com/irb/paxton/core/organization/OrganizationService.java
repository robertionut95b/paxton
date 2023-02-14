package com.irb.paxton.core.organization;

import com.irb.paxton.core.organization.exception.OrganizationNotExistsException;
import com.irb.paxton.core.organization.input.OrganizationInput;
import com.irb.paxton.core.organization.mapper.OrganizationMapper;
import com.irb.paxton.core.process.ProcessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
public class OrganizationService {

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private OrganizationMapper organizationMapper;

    @Autowired
    private ProcessService processService;

    @Transactional
    public Organization createOrUpdateOrganization(OrganizationInput organizationInput) {
        Organization organization;
        if (organizationInput.getId() != null) {
            organization = this.organizationRepository
                    .findById(organizationInput.getId())
                    .orElseThrow(() -> new OrganizationNotExistsException("Organization by id %s does not exist".formatted(organizationInput.getId())));
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
                .orElseThrow(() -> new OrganizationNotExistsException("Organization %s does not exist".formatted(slugName)));
    }
}
