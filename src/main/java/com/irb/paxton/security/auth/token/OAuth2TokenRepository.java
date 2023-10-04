package com.irb.paxton.security.auth.token;

import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.Optional;

@Repository
public interface OAuth2TokenRepository extends TokenRepository<OAuth2Token> {

    Optional<OAuth2Token> findByExpiresAtGreaterThanAndUserId(OffsetDateTime expiresAt, Long userId);
}
