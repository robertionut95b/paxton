package com.irb.paxton.security.auth.token;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;

@Transactional
public interface TokenRegistrationRepository extends TokenRepository<RegistrationToken> {

    Optional<RegistrationToken> findByExpiresAtGreaterThanAndUserId(LocalDateTime expiresAt, Long id);
}
