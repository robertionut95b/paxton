package com.irb.paxton.core.messaging.security;

import com.irb.paxton.core.model.security.PaginationSecurityService;
import com.irb.paxton.core.search.PaginatedResponse;
import org.springframework.security.core.Authentication;

public interface MessageSecurityService extends PaginationSecurityService {

    @Override
    default boolean isSecured(Authentication authentication, PaginatedResponse<Object> response) {
        return this.isMessageChatMember(authentication, response);
    }

    boolean isMessageChatMember(Authentication authentication, PaginatedResponse<Object> response);

}
