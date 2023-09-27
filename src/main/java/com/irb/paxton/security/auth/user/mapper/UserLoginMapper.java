package com.irb.paxton.security.auth.user.mapper;

import com.irb.paxton.security.auth.role.Role;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.dto.UserLoginResponseDto;
import com.irb.paxton.security.auth.utils.AuthoritiesUtils;
import jakarta.validation.constraints.NotNull;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.security.core.GrantedAuthority;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public abstract class UserLoginMapper {

    @Mapping(target = "sessionTime", expression = "java(java.time.Duration.between(Instant.now(), expiresAt).toMillis())")
    @Mapping(target = "profileSlugUrl", source = "user.userProfile.profileSlugUrl")
    @Mapping(target = "permissions", source = "user", qualifiedByName = "permissionsMap")
    @Mapping(target = "roles", source = "user", qualifiedByName = "roleNamesMap")
    public abstract UserLoginResponseDto userToUserLoginResponseDto(User user, Instant expiresAt);

    @Named(value = "permissionsMap")
    public List<String> getPermissions(@NotNull User user) {
        return AuthoritiesUtils.getAuthorities(user.getRoles()).stream()
                .map(GrantedAuthority::getAuthority).collect(Collectors.toList());
    }

    @Named(value = "roleNamesMap")
    public List<String> getRoleNames(@NotNull User user) {
        return user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());
    }
}
