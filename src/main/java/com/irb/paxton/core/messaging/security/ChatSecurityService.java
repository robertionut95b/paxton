package com.irb.paxton.core.messaging.security;

public interface ChatSecurityService {

    boolean isCurrentUserChatMember(Long chatId);

    boolean isChatMember(Long chatId, Long userId);
}
