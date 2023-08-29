package com.irb.paxton.core.connection.mapper;

import com.irb.paxton.core.connection.ConnectionRequest;
import com.irb.paxton.core.connection.input.ConnectionRequestCreateInput;
import com.irb.paxton.core.connection.input.ConnectionRequestUpdateInput;
import com.irb.paxton.core.model.mapper.ReferenceMapper;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserRepository;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING,
        uses = {ReferenceMapper.class})
public abstract class ConnectionRequestMapper {

    @Autowired
    private UserRepository userRepository;

    @Mapping(target = "requester", source = "connectionRequestCreateInput.requesterId")
    @Mapping(target = "addressed", source = "connectionRequestCreateInput.addressedId")
    public abstract ConnectionRequest toEntity(ConnectionRequestCreateInput connectionRequestCreateInput);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    public abstract ConnectionRequest partialUpdate(ConnectionRequestUpdateInput connectionRequestUpdateInput, @MappingTarget ConnectionRequest connectionRequest);

    public User mapUserId(Long userId) {
        return this.userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User by id %s does not exist".formatted(userId)));
    }
}