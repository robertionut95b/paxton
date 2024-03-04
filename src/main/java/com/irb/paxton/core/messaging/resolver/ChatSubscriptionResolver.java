package com.irb.paxton.core.messaging.resolver;

import com.irb.paxton.core.messaging.ChatService;
import com.irb.paxton.core.messaging.Message;
import com.irb.paxton.core.messaging.dto.ChatLiveUpdateDto;
import com.irb.paxton.security.AuthenticationService;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserService;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsSubscription;
import org.reactivestreams.Publisher;
import org.springframework.security.core.Authentication;

import javax.naming.AuthenticationException;

@DgsComponent
public class ChatSubscriptionResolver {

    private final ChatService chatService;

    private final AuthenticationService authenticationService;

    private final UserService userService;

    public ChatSubscriptionResolver(ChatService chatService, AuthenticationService authenticationService, UserService userService) {
        this.chatService = chatService;
        this.authenticationService = authenticationService;
        this.userService = userService;
    }

    // Found no way to access the security context in reactive methods by DGS subscriptions, will paas the JWT in the method's arguments and set the context manually
    // TODO: Find a way to access the security context in reactive methods for DGS subscriptions
    @DgsSubscription
    public Publisher<Message> getMessagesForChatId(Long chatId, String auth) throws AuthenticationException {
        // if the authentication is based on jwt, we parse the auth param and assign security context
        Authentication authentication = authenticationService.identifyUserInToken(auth);
        if (authentication == null) {
            throw new AuthenticationException();
        }
        return chatService.getChatMessagesPublisher(chatId);
    }

    @DgsSubscription
    public Publisher<ChatLiveUpdateDto> getLiveUpdatesForChats(String auth) throws AuthenticationException {
        // if the authentication is based on jwt, we parse the auth param and assign security context
        Authentication authentication = authenticationService.identifyUserInToken(auth);
        if (authentication == null) {
            throw new AuthenticationException();
        }
        User user = this.userService
                .findByUsername(authentication.getName())
                .orElseThrow(AuthenticationException::new);
        return chatService.getLiveUpdatesForChats(user);
    }
}
