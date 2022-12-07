package com.irb.paxton.security.auth.jwt.token;

import com.irb.paxton.security.auth.jwt.JwtTokenProvider;
import com.irb.paxton.security.auth.jwt.token.exceptions.TokenRefreshException;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserRepository;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class RefreshTokenService {
    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserRepository userRepository;

    public Optional<RefreshToken> findByToken(String token) {
        return this.refreshTokenRepository.findByToken(token);
    }

    public Optional<RefreshToken> findByUserName(String username) {
        return this.refreshTokenRepository.findByUser_Username(username);
    }


    public RefreshToken createRefreshToken(String username) {
        // check if for this login already exists a non-expired token
        User user = this.userRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException("User does not exist"));
        return this.refreshTokenRepository
                .findByUserIdAndExpiresAtAfter(user.getId(), LocalDateTime.now())
                .orElseGet(() ->
                        refreshTokenRepository.save(
                                new RefreshToken(null, jwtTokenProvider.generateRefreshTokenFromUser(), user, 0L,
                                        LocalDateTime.now().plusSeconds(jwtTokenProvider.getRefreshExpiry()))
                        )
                );
    }

    public void verifyExpiration(RefreshToken token) {
        if (LocalDateTime.now().isAfter(token.getExpiresAt())) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException("Refresh token was expired. Please make a new sign-in request");
        }
    }

    public void deleteById(Long tokenId) {
        this.refreshTokenRepository.deleteById(tokenId);
    }

    @Transactional
    public void deleteByUserId(Long userId) {
        this.refreshTokenRepository.deleteByUser_Id(userId);
    }

    public void increaseCount(RefreshToken refreshToken) {
        refreshToken.incrementRefreshCount();
        refreshTokenRepository.save(refreshToken);
    }
}
