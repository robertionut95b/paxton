package com.irb.paxton.security.auth.jwt.token;

import com.irb.paxton.security.auth.jwt.JwtTokenProvider;
import com.irb.paxton.security.auth.jwt.token.exceptions.TokenRefreshException;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserRepository;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class RefreshTokenService {

    @Value("${px.auth.token.expiryRefresh:3600}")
    private Long expiryTime;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserRepository userRepository;

    public Optional<RefreshToken> findByToken(String token) {
        return this.refreshTokenRepository.findByToken(token);
    }

    public RefreshToken createRefreshToken(String username) {
        // check if for this login already exists a non-expired token
        User user = this.userRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException("User does not exist"));
        return this.refreshTokenRepository
                .findByUserIdAndExpiresAtAfter(user.getId(), LocalDateTime.now())
                .orElseGet(() -> refreshTokenRepository.save(
                        new RefreshToken(jwtTokenProvider.generateRefreshTokenFromUser(), user, 0L, LocalDateTime.now().plusSeconds(expiryTime)))
                );
    }

    public void verifyExpiration(RefreshToken token) {
        if (LocalDateTime.now().isAfter(token.getExpiresAt())) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException("Refresh token was expired. Please make a new sign-in request");
        }
    }

    @Transactional
    public void deleteByUsername(String userName) {
        refreshTokenRepository.deleteByUserUsername(userName);
    }

    public void increaseCount(RefreshToken refreshToken) {
        refreshToken.incrementRefreshCount();
        refreshTokenRepository.save(refreshToken);
    }
}
