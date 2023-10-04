package com.irb.paxton.security.auth.token;

import com.irb.paxton.security.auth.user.User;

import java.util.Optional;
import java.util.UUID;

public interface TokenService<T extends Token> {

    Optional<T> getTokenById(UUID id);

    void expireToken(T token);

    void checkDuplicateTokenForUser(User user);

    T createTokenForUser(User user);
}
