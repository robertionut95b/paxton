package com.irb.paxton.security.auth.token;

import com.irb.paxton.security.auth.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class ForgotTokenService {

    @Autowired
    private TokenForgotRepository tokenRepository;

    public ForgotPasswordToken createForgotRequestToken(User user) {
        ForgotPasswordToken tkn = new ForgotPasswordToken(user, LocalDateTime.now().plusMinutes(15), false);
        tkn.setTokenType(TokenType.PASSWORD_RESET);
        this.tokenRepository.save(tkn);
        return tkn;
    }

    public void expireToken(ForgotPasswordToken token) {
        token.setExpiresAt(LocalDateTime.now());
        this.tokenRepository.save(token);
    }

    public Optional<ForgotPasswordToken> getForgotRequestToken(UUID token) {
        return Optional.ofNullable(this.tokenRepository.findById(token));
    }
}
