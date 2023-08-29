package com.irb.paxton.core.connection.projections;

import com.irb.paxton.core.connection.status.ConnectionStatus;
import com.irb.paxton.security.auth.user.User;

import lombok.Data;

@Data
public class ConnectionInvitation {

    private User requester;

    private ConnectionStatus status;
}
