package com.irb.paxton.core.connection;

import com.irb.paxton.core.connection.status.ConnectionStatus;
import com.irb.paxton.core.model.AbstractRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConnectionRepository extends AbstractRepository<Connection, Long> {

    List<Connection> findByRequester_IdOrAddressed_Id(Long id, Long id1);

    Optional<Connection> findFirstByRequester_IdAndAddressed_Id(Long id, Long id1);

    @Query("""
            select c from Connection c
               where (c.requester.id = :id or c.addressed.id = :id) and c.connectionStatus = :connectionStatus
                and (c.addressed.id <> :id and (lower(c.requester.firstName) LIKE %:searchQuery% or lower(c.requester.lastName) LIKE %:searchQuery% or lower(c.requester.username) LIKE %:searchQuery%)
                or (c.requester.id <> :id and (lower(c.addressed.firstName) LIKE %:searchQuery% or lower(c.addressed.lastName) LIKE %:searchQuery% or lower(c.addressed.username) LIKE %:searchQuery%)))
            order by c.lastModified DESC
            """)
    Page<Connection> queryByRequester_IdOrAddressed_IdAndConnectionStatusOrderByLastModifiedDesc(@Param("id") Long id, @Param("connectionStatus") ConnectionStatus connectionStatus, @Param("searchQuery") String searchQuery, Pageable pageable);
}
