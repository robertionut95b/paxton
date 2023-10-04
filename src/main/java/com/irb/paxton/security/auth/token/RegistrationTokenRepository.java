package com.irb.paxton.security.auth.token;

import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.Optional;

@Repository
public interface RegistrationTokenRepository extends TokenRepository<RegistrationToken> {

    Optional<RegistrationToken> findByExpiresAtGreaterThanAndUserId(OffsetDateTime expiresAt, Long id);
}
