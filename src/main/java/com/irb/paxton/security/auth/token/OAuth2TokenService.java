package com.irb.paxton.security.auth.token;

import com.irb.paxton.security.auth.token.exceptions.TokenAlreadyExistsException;
import com.irb.paxton.security.auth.user.User;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.Optional;

@Service
public class OAuth2TokenService extends AbstractTokenService<OAuth2Token> {

    private final OAuth2TokenRepository oAuth2TokenRepository;

    protected OAuth2TokenService(TokenRepository<OAuth2Token> tokenRepository, OAuth2TokenRepository oAuth2TokenRepository) {
        super(tokenRepository);
        this.oAuth2TokenRepository = oAuth2TokenRepository;
    }

    @Override
    public OAuth2Token createTokenForUser(User user) {
        this.checkDuplicateTokenForUser(user);
        OAuth2Token oAuth2Token = new OAuth2Token(user);
        return this.oAuth2TokenRepository.save(oAuth2Token);
    }

    @Override
    public void checkDuplicateTokenForUser(User user) {
        Optional<OAuth2Token> tokenOptional = this.oAuth2TokenRepository.findByExpiresAtGreaterThanAndUserId(OffsetDateTime.now(), user.getId());
        if (tokenOptional.isPresent()) {
            throw new TokenAlreadyExistsException("Valid token already exists for this user");
        }
    }
}
