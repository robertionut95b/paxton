package com.irb.paxton.core.messaging;

import com.irb.paxton.core.messaging.type.ChatType;
import com.irb.paxton.core.model.AbstractRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.Query;

public interface MessageRepository extends AbstractRepository<Message, Long> {

    @Query("select m from Message m where m.chat.id = ?1 and m.chat.chatType = ?2 order by m.deliveredAt DESC")
    Slice<Message> findByChat_IdAndChat_ChatTypeOrderByDeliveredAtDesc(Long id, ChatType chatType, Pageable pageable);
}
