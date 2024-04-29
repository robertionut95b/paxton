package com.irb.paxton.core.messaging;

import com.irb.paxton.core.model.AbstractRepository;
import com.irb.paxton.core.model.AbstractService;
import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SearchRequest;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.stereotype.Service;

@Service
public class MessageService extends AbstractService<Message> {

    protected MessageService(AbstractRepository<Message> repository) {
        super(repository);
    }

    @PostAuthorize("@messageSecurityService.isMessageChatMember(authentication, returnObject)")
    public PaginatedResponse<Message> getMessagesPaginated(SearchRequest searchQuery) {
        return super.advSearch(searchQuery);
    }

    @PostAuthorize("@messageSecurityService.isMessageChatMember(authentication, returnObject)")
    public Message getMessageByUrlId(String urlId) {
        return super.findByUrlId(urlId);
    }
}
