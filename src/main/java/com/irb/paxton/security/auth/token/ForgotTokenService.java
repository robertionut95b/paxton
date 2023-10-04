package com.irb.paxton.security.auth.token;

import com.irb.paxton.security.auth.token.exceptions.TokenAlreadyExistsException;
import com.irb.paxton.security.auth.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.Optional;

@Service
public class ForgotTokenService extends AbstractTokenService<ForgotPasswordToken> {

    @Autowired
    private ForgotTokenRepository forgotTokenRepository;

    protected ForgotTokenService(TokenRepository<ForgotPasswordToken> tokenRepository) {
        super(tokenRepository);
    }

    @Override
    public void checkDuplicateTokenForUser(User user) {
        Optional<ForgotPasswordToken> tokenOptional = this.forgotTokenRepository.findByExpiresAtGreaterThanAndUserId(OffsetDateTime.now(), user.getId());
        if (tokenOptional.isPresent()) {
            throw new TokenAlreadyExistsException("Valid token already exists for this user");
        }
    }

    @Override
    public ForgotPasswordToken createTokenForUser(User user) {
        checkDuplicateTokenForUser(user);
        ForgotPasswordToken tkn = new ForgotPasswordToken(user);
        return this.forgotTokenRepository.save(tkn);
    }
}
