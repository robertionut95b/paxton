package com.irb.paxton.security.auth.jwt.token;

import com.irb.paxton.security.auth.jwt.JwtTokenProvider;
import com.irb.paxton.security.auth.jwt.token.exceptions.TokenRefreshException;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserRepository;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    @Transactional
    public void deleteByToken(String token) {
        this.refreshTokenRepository.deleteByToken(token);
    }

    public RefreshToken createRefreshTokenForUsername(String username) {
        // check if for this login already exists a non-expired token
        User user = this.userRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException("User [%s] does not exist".formatted(username)));
        return this.refreshTokenRepository.save(
                new RefreshToken(jwtTokenProvider.generateRefreshTokenFromUser(), user, 0L,
                        LocalDateTime.now().plusSeconds(jwtTokenProvider.getRefreshExpiry()))
        );
    }

    public void verifyExpiration(RefreshToken token) {
        if (LocalDateTime.now().isAfter(token.getExpiresAt())) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException("Refresh token was expired. Please make a new sign-in request");
        }
    }

    public boolean verifyReuse(RefreshToken token) {
        if (token.getRefreshCount() > 0) {
            // delete all user tokens and force to re-login
            refreshTokenRepository.deleteAllByUser_Id(token.getUser().getId());
            return true;
        }
        return false;
    }

    @Transactional
    public void deleteByUserId(Long userId) {
        this.refreshTokenRepository.deleteByUser_Id(userId);
    }

}
