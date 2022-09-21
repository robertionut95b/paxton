package com.irb.paxton.security.auth.token;

import java.time.LocalDateTime;
import java.util.Optional;

public interface TokenForgotRepository extends TokenRepository<ForgotPasswordToken> {

    Optional<ForgotPasswordToken> findByExpiresAtGreaterThanAndUserId(LocalDateTime expiresAt, Long userId);
}
