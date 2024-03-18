package com.irb.paxton.core.messaging;

import com.irb.paxton.core.model.AbstractFileEntityRepository;
import com.irb.paxton.core.model.AbstractFileService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MessageFileService extends AbstractFileService<MessageFile> {

    private final MessageFileRepository repository;

    protected MessageFileService(AbstractFileEntityRepository<MessageFile> repository) {
        super(repository);
        this.repository = (MessageFileRepository) repository;
    }

    public Optional<MessageFile> findByChatIdMessageIdAndFileNameOpt(Long chatId, Long messageId, String fileName) {
        return repository
                .findByMessage_Chat_IdAndMessage_IdAndName(chatId, messageId, fileName);
    }
}
