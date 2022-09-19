package com.irb.paxton.security.auth.token;

import javax.transaction.Transactional;

@Transactional
public interface TokenRegistrationRepository extends TokenRepository<RegistrationToken> {
}
