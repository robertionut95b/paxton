package com.irb.paxton.security.auth.token;

import com.irb.paxton.security.auth.token.exceptions.TokenAlreadyExistsException;
import com.irb.paxton.security.auth.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.Optional;

@Service
public class RegistrationTokenService extends AbstractTokenService<RegistrationToken> {

    @Autowired
    private RegistrationTokenRepository registrationTokenRepository;

    protected RegistrationTokenService(TokenRepository<RegistrationToken> tokenRepository) {
        super(tokenRepository);
    }

    @Override
    public void checkDuplicateTokenForUser(User user) {
        Optional<RegistrationToken> tokenOptional = this.registrationTokenRepository.findByExpiresAtGreaterThanAndUserId(OffsetDateTime.now(), user.getId());
        if (tokenOptional.isPresent()) {
            throw new TokenAlreadyExistsException("Valid token already exists for this user");
        }
    }

    @Override
    public RegistrationToken createTokenForUser(User user) {
        checkDuplicateTokenForUser(user);
        RegistrationToken tkn = new RegistrationToken(user);
        return this.registrationTokenRepository.save(tkn);
    }
}
