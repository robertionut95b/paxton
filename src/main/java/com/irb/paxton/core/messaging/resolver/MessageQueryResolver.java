package com.irb.paxton.core.messaging.resolver;

import com.irb.paxton.core.messaging.Message;
import com.irb.paxton.core.messaging.MessageService;
import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SearchRequest;
import com.irb.paxton.core.search.SlicedResponse;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import org.springframework.beans.factory.annotation.Autowired;

@DgsComponent
public class MessageQueryResolver {

    @Autowired
    private MessageService messageService;

    @DgsQuery
    public SlicedResponse<Message> getMessagesSliced(@InputArgument SearchRequest searchQuery) {
        return this.messageService.getMessagesSliced(searchQuery);
    }

    @DgsQuery
    public PaginatedResponse<Message> getMessagesPaginated(@InputArgument SearchRequest searchQuery) {
        return this.messageService.getMessagesPaginated(searchQuery);
    }
}
