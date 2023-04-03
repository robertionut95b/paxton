package com.irb.paxton.core.messaging.resolver;

import com.irb.paxton.core.messaging.Message;
import com.irb.paxton.core.messaging.MessageService;
import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SearchRequest;
import com.irb.paxton.core.search.SlicedResponse;
import graphql.kickstart.tools.GraphQLQueryResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class MessageQueryResolver implements GraphQLQueryResolver {

    @Autowired
    private MessageService messageService;

    SlicedResponse<Message> getMessagesSliced(SearchRequest searchQuery) {
        return this.messageService.getMessagesSliced(searchQuery);
    }

    PaginatedResponse<Message> getMessagesPaginated(SearchRequest searchQuery) {
        return this.messageService.getMessagesPaginated(searchQuery);
    }
}
