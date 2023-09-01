package com.irb.paxton.core.connection;

import com.irb.paxton.core.connection.status.ConnectionStatus;
import com.irb.paxton.core.model.AbstractRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConnectionRepository extends AbstractRepository<Connection, Long> {

    List<Connection> findByRequester_IdOrAddressed_Id(Long id, Long id1);

    @Query("""
            select c from Connection c
            where (c.requester.id = :id or c.addressed.id = :id1) and c.connectionStatus = :connectionStatus""")
    Page<Connection> findByRequester_IdOrAddressed_IdAndConnectionStatus(@Param("id") Long id, @Param("id1") Long id1, @Param("connectionStatus") ConnectionStatus connectionStatus, Pageable pageable);


}
