package com.irb.paxton.security.auth.token;

import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public abstract class AbstractTokenService<T extends Token> implements TokenService<T> {

    private final TokenRepository<T> tokenRepository;

    protected AbstractTokenService(TokenRepository<T> tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    @Override
    public Optional<T> getTokenById(UUID id) {
        return this.tokenRepository.findById(id);
    }

    @Override
    public void expireToken(T token) {
        token.setExpiresAt(OffsetDateTime.now());
        this.tokenRepository.save(token);
    }
}
