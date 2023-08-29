package com.irb.paxton.core.connection;

import org.springframework.stereotype.Repository;

import com.irb.paxton.core.connection.projections.ConnectionInvitation;
import com.irb.paxton.core.model.AbstractRepository;

@Repository
public interface ConnectionRequestRepository extends AbstractRepository<ConnectionRequest, Long> {

    public ConnectionInvitation findByAddressed(Long userId);
}
