package com.irb.paxton.core.messaging;

import com.irb.paxton.core.messaging.type.ChatType;
import com.irb.paxton.core.model.AbstractRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRepository extends AbstractRepository<Chat> {

    List<Chat> findDistinctByUsers_IdIn(Collection<Long> ids);

    @Query("select c from Chat c where c.id = ?1 and c.chatType = ?2")
    Optional<Chat> findByIdAndChatType(Long id, ChatType chatType);

    Optional<Chat> findByUrlIdAndChatType(String urlId, ChatType chatType);

}
