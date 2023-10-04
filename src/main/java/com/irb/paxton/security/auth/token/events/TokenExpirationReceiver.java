package com.irb.paxton.security.auth.token.events;

import com.irb.paxton.security.auth.token.*;
import com.irb.paxton.security.auth.token.exceptions.TokenNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@Slf4j
public class TokenExpirationReceiver {

    @Autowired
    private OAuth2TokenService oAuth2TokenService;

    @Autowired
    private RegistrationTokenService registrationTokenService;

    @Autowired
    private ForgotTokenService forgotTokenService;

    @JmsListener(destination = "tokenExpirationQueue")
    public void expireToken(TokenExpirationEvent tokenExpirationEvent) {
        switch (tokenExpirationEvent.getTokenType()) {
            case OAUTH2_AUTHORIZATION -> {
                OAuth2Token oAuth2Token = oAuth2TokenService
                        .getTokenById(UUID.fromString(tokenExpirationEvent.getToken()))
                        .orElseThrow(() -> new TokenNotFoundException("Token not found"));
                oAuth2TokenService.expireToken(oAuth2Token);
            }
            case REGISTRATION -> {
                RegistrationToken registrationToken = registrationTokenService
                        .getTokenById(UUID.fromString(tokenExpirationEvent.getToken()))
                        .orElseThrow(() -> new TokenNotFoundException("Token not found"));
                registrationTokenService.expireToken(registrationToken);
            }
            case PASSWORD_RESET -> {
                ForgotPasswordToken forgotPasswordToken = forgotTokenService
                        .getTokenById(UUID.fromString(tokenExpirationEvent.getToken()))
                        .orElseThrow(() -> new TokenNotFoundException("Token not found"));
                forgotTokenService.expireToken(forgotPasswordToken);
            }
            default -> throw new IllegalArgumentException("Invalid token type");
        }
    }
}
