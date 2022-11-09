package com.irb.paxton.core.profile.mapper;

import com.irb.paxton.core.location.City;
import com.irb.paxton.core.location.CityRepository;
import com.irb.paxton.core.location.exception.CityNotFoundException;
import com.irb.paxton.core.profile.UserProfile;
import com.irb.paxton.core.profile.input.UserProfileInput;
import com.irb.paxton.security.auth.user.User;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class UserProfileMapper {

    @Autowired
    private CityRepository cityRepository;

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "studies", ignore = true)
    @Mapping(target = "photography", ignore = true)
    @Mapping(target = "modifiedBy", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "experiences", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "coverPhotography", ignore = true)
    public abstract UserProfile userProfileInputToUserProfile(UserProfileInput userProfileInput);

    public City map(String cityValue) {
        return this.cityRepository.findByName(cityValue)
                .orElseThrow(() -> new CityNotFoundException(String.format("%s does not exist", cityValue), "city"));
    }


    @Mapping(target = "user", ignore = true)
    @Mapping(target = "studies", ignore = true)
    @Mapping(target = "photography", ignore = true)
    @Mapping(target = "modifiedBy", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "experiences", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "coverPhotography", ignore = true)
    @Mapping(target = "userProfile.profileTitle", source = "userProfileInput.profileTitle")
    @Mapping(target = "userProfile.description", source = "userProfileInput.description")
    @Mapping(target = "userProfile.profileSlugUrl", source = "userProfileInput.profileSlugUrl")
    @Mapping(target = "userProfile.city", source = "userProfileInput.city")
    public abstract UserProfile updateUserProfile(@MappingTarget UserProfile userProfile, UserProfileInput userProfileInput);

    @Mapping(target = "username", ignore = true)
    @Mapping(target = "userProfile", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "modifiedBy", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "emailConfirmed", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "credentials", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "birthDate", ignore = true)
    @Mapping(target = "user.lastName", source = "userProfileInput.lastName")
    @Mapping(target = "user.firstName", source = "userProfileInput.firstName")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
    public abstract void updateUserFields(@MappingTarget User user, UserProfileInput userProfileInput);
}
