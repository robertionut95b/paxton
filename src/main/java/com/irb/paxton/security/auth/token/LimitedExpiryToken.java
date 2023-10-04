package com.irb.paxton.security.auth.token;

import java.time.OffsetDateTime;

public interface LimitedExpiryToken {

    OffsetDateTime getExpiresAt();

    boolean isExpired();
}
