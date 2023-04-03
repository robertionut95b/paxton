package com.irb.paxton.core.messaging;

import com.irb.paxton.core.messaging.type.ChatType;
import com.irb.paxton.core.model.AbstractRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRepository extends AbstractRepository<Chat, Long> {
    @Query("select c from Chat c where c.id = ?1 and c.chatType = ?2")
    Optional<Chat> findByIdAndChatType(Long id, ChatType chatType);

    List<Chat> findByUsers_IdAndChatTypeOrderByModifiedAtDesc(Long id, ChatType chatType);

    @Query("""
            select c from Chat c inner join c.users users inner join c.messages messages
            where users.id = ?1 and c.chatType = ?2 and upper(messages.content) like upper(concat('%', ?3, '%'))""")
    List<Chat> findByUsers_IdAndChatTypeAndMessages_ContentContainsIgnoreCase(Long id, ChatType chatType, String content);
}
