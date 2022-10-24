package com.irb.paxton.security.auth.jwt.token;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {

    Optional<RefreshToken> findByToken(String token);

    void deleteByUserUsername(String userName);

    Optional<RefreshToken> findByUserIdAndExpiresAtAfter(Long userId, LocalDateTime localDateTime);
}
