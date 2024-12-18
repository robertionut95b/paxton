package com.irb.paxton.security.auth.user.mapper;

import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.dto.UserCreateDto;
import com.irb.paxton.security.auth.user.dto.UserUpdateDto;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public abstract class UserMapper {

    public abstract User dtoToEntity(UserCreateDto userCreateDto);

    public abstract User updateUserByDto(@MappingTarget User user, UserUpdateDto userUpdateDto);
}
