package com.irb.paxton.core.organization;

import com.irb.paxton.core.organization.input.OrganizationInput;
import com.irb.paxton.core.organization.mapper.OrganizationMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrganizationService {

    @Autowired
    OrganizationRepository organizationRepository;

    @Autowired
    OrganizationMapper organizationMapper;

    public Organization createOrUpdateOrganization(OrganizationInput organizationInput) {
        return organizationRepository.findById(organizationInput.getId())
                .map(o -> {
                    organizationMapper.updateOrganizationFromOrganizationInput(organizationInput, o);
                    System.out.println(o.toString());
                    organizationRepository.save(o);
                    return o;
                })
                .orElseGet(() -> {
                    Organization o = organizationMapper.organizationInputToOrganization(organizationInput);
                    System.out.println(o.toString());
                    organizationRepository.save(o);
                    return o;
                });
    }
}
