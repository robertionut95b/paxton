package com.irb.paxton.core.messaging;

import com.irb.paxton.core.model.AbstractFileEntityRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MessageFileRepository extends AbstractFileEntityRepository<MessageFile> {


    Optional<MessageFile> findByMessage_Chat_IdAndMessage_IdAndName(Long id, Long id1, String name);
}
