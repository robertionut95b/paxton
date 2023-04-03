package com.irb.paxton.core.messaging.security;

import com.irb.paxton.core.model.security.PaginationSecurityService;
import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SlicedResponse;
import org.springframework.security.core.Authentication;

public interface ChatSecurityService extends PaginationSecurityService {

    @Override
    default boolean isSecured(Authentication authentication, SlicedResponse<Object> response) {
        return this.isChatMember(authentication, response);
    }

    @Override
    default boolean isSecured(Authentication authentication, PaginatedResponse<Object> response) {
        return this.isChatMember(authentication, response);
    }

    boolean isChatMember(Authentication authentication, PaginatedResponse<Object> response);

    boolean isChatMember(Authentication authentication, SlicedResponse<Object> response);

    boolean isCurrentUserChatMember(Long chatId);

    boolean isChatMember(Long chatId, Long userId);
}
