package com.irb.paxton.core.connection.projections;

import com.irb.paxton.core.model.Identifiable;
import com.irb.paxton.security.auth.user.User;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@AllArgsConstructor
public class ConnectionUserDto implements Identifiable<Long> {

    private Long id;

    private User user;

    private OffsetDateTime connectedAt;
}
