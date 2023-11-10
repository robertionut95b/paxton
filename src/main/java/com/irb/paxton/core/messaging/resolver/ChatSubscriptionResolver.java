package com.irb.paxton.core.messaging.resolver;

import com.irb.paxton.core.messaging.ChatService;
import com.irb.paxton.core.messaging.Message;
import com.irb.paxton.security.AuthenticationService;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsSubscription;
import org.reactivestreams.Publisher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;

import java.nio.file.AccessDeniedException;

@DgsComponent
public class ChatSubscriptionResolver {

    @Autowired
    private ChatService chatService;

    @Autowired
    private AuthenticationService authenticationService;

    // Found no way to access the security context in reactive methods by DGS subscriptions, will paas the JWT in the method's arguments and set the context manually
    // TODO: Find a way to access the security context in reactive methods for DGS subscriptions
    @DgsSubscription
    public Publisher<Message> getMessagesForChatId(Long chatId, String auth) throws AccessDeniedException {
        // if the authentication is based on jwt, we parse the auth param and assign security context
        Authentication authentication = authenticationService.identifyUserInToken(auth);
        if (authentication == null) {
            throw new AccessDeniedException("Access denied");
        }
        return chatService.getChatMessagesPublisher(chatId);
    }
}
