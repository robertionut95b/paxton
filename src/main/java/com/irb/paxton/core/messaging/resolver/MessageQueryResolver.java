package com.irb.paxton.core.messaging.resolver;

import com.irb.paxton.core.messaging.Message;
import com.irb.paxton.core.messaging.MessageService;
import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SearchRequest;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;

@DgsComponent
public class MessageQueryResolver {

    private final MessageService messageService;

    public MessageQueryResolver(MessageService messageService) {
        this.messageService = messageService;
    }

    @DgsQuery
    public PaginatedResponse<Message> getMessagesPaginated(@InputArgument SearchRequest searchQuery) {
        return this.messageService.getMessagesPaginated(searchQuery);
    }

    @DgsQuery
    public Message getMessageByUrlId(String urlId) {
        return this.messageService.getMessageByUrlId(urlId);
    }
}
