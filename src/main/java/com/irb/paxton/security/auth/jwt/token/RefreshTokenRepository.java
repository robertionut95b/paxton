package com.irb.paxton.security.auth.jwt.token;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);

    Optional<RefreshToken> findByUser_Username(String username);

    Optional<RefreshToken> findByUserIdAndExpiresAtAfter(Long userId, LocalDateTime localDateTime);

    void deleteByUser_Id(Long userId);
}
