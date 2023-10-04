package com.irb.paxton.security.auth.token;

import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.Optional;

@Repository
public interface ForgotTokenRepository extends TokenRepository<ForgotPasswordToken> {

    Optional<ForgotPasswordToken> findByExpiresAtGreaterThanAndUserId(OffsetDateTime expiresAt, Long userId);
}
