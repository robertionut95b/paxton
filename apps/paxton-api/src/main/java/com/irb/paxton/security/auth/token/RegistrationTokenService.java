package com.irb.paxton.security.auth.token;

import com.irb.paxton.security.auth.token.exceptions.TokenAlreadyExistsException;
import com.irb.paxton.security.auth.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class RegistrationTokenService {

    @Autowired
    private TokenRegistrationRepository tokenRepository;

    public void checkDuplicateTokenForUser(User user) {
        Optional<RegistrationToken> tokenOptional = this.tokenRepository.findByExpiresAtGreaterThanAndUserId(LocalDateTime.now(), user.getId());
        if (tokenOptional.isPresent()) {
            throw new TokenAlreadyExistsException("Valid token already exists for this user");
        }
    }

    public RegistrationToken createUserRegistrationToken(User user) {
        checkDuplicateTokenForUser(user);
        RegistrationToken tkn = new RegistrationToken(user, LocalDateTime.now().plusMinutes(15), false);
        tkn.setTokenType(TokenType.REGISTRATION);
        this.tokenRepository.save(tkn);
        return tkn;
    }

    public Optional<RegistrationToken> getRegistrationToken(UUID token) {
        return Optional.ofNullable(this.tokenRepository.findById(token));
    }

    public void expireToken(RegistrationToken token) {
        token.setExpiresAt(LocalDateTime.now());
        this.tokenRepository.save(token);
    }

    public RegistrationToken updateToken(RegistrationToken token) {
        return this.tokenRepository.save(token);
    }
}
