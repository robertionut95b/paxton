package com.irb.paxton.core.organization.mapper;

import com.irb.paxton.core.organization.Organization;
import com.irb.paxton.core.organization.OrganizationRepository;
import com.irb.paxton.core.organization.Recruiter;
import com.irb.paxton.core.organization.exception.OrganizationNotExistsException;
import com.irb.paxton.core.organization.input.RecruiterInput;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserRepository;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring")
public abstract class RecruiterMapper {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Mapping(target = "organization", source = "organizationId")
    @Mapping(target = "user", source = "recruiterInput.id")
    @Mapping(target = "id", source = "recruiterInput.id")
    @Mapping(target = "active", constant = "true")
    public abstract Recruiter toEntity(RecruiterInput recruiterInput, Long organizationId);

    public User mapUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User by id %s does not exist".formatted(id)));
    }

    public Organization mapOrganization(Long id) {
        return organizationRepository.findById(id)
                .orElseThrow(() -> new OrganizationNotExistsException("Organization by id %s does not exist".formatted(id), "organizationId"));
    }

    @Mapping(target = "organization", source = "recruiterInput.organizationId")
    @Mapping(target = "user", source = "recruiterInput.id")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    public abstract Recruiter partialUpdate(RecruiterInput recruiterInput, @MappingTarget Recruiter recruiter);
}