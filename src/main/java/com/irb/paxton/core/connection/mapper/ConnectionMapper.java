package com.irb.paxton.core.connection.mapper;

import com.irb.paxton.core.connection.Connection;
import com.irb.paxton.core.connection.input.ConnectionCreateInput;
import com.irb.paxton.core.connection.input.ConnectionUpdateInput;
import com.irb.paxton.core.model.mapper.ReferenceMapper;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserRepository;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING,
        uses = {ReferenceMapper.class})
public abstract class ConnectionMapper {

    @Autowired
    private UserRepository userRepository;

    @Mapping(target = "requester", source = "connectionCreateInput.requesterId")
    @Mapping(target = "addressed", source = "connectionCreateInput.addressedId")
    public abstract Connection toEntity(ConnectionCreateInput connectionCreateInput);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    public abstract Connection partialUpdate(ConnectionUpdateInput connectionUpdateInput, @MappingTarget Connection connection);

    public User mapUserId(Long userId) {
        return this.userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User by id %s does not exist".formatted(userId)));
    }
}