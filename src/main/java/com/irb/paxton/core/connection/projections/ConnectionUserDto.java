package com.irb.paxton.core.connection.projections;

import com.irb.paxton.core.model.Identifiable;
import com.irb.paxton.security.auth.user.User;

import java.time.OffsetDateTime;

public interface ConnectionUserDto extends Identifiable<Long> {

    Long getId();

    User getUser();

    OffsetDateTime getConnectedAt();
}
