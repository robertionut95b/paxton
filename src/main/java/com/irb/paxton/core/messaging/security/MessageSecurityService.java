package com.irb.paxton.core.messaging.security;

import com.irb.paxton.core.model.security.PaginationSecurityService;
import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SlicedResponse;
import org.springframework.security.core.Authentication;

public interface MessageSecurityService extends PaginationSecurityService {

    @Override
    default boolean isSecured(Authentication authentication, SlicedResponse<Object> response) {
        return this.isMessageChatMember(authentication, response);
    }

    @Override
    default boolean isSecured(Authentication authentication, PaginatedResponse<Object> response) {
        return this.isMessageChatMember(authentication, response);
    }

    boolean isMessageChatMember(Authentication authentication, PaginatedResponse<Object> response);

    boolean isMessageChatMember(Authentication authentication, SlicedResponse<Object> response);
}
