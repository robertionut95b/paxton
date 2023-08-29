package com.irb.paxton.core.connection;

import com.irb.paxton.core.connection.status.ConnectionStatus;
import com.irb.paxton.core.model.AbstractRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface ConnectionRepository extends AbstractRepository<Connection, Long> {
    
    List<Connection> findBySecondUser_UsernameAndConnectionStatusIn(String username, Collection<ConnectionStatus> connectionStatuses);

}
