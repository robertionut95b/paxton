package com.irb.paxton.security.auth.jwt.token;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);

    void deleteByUser_Id(Long userId);

    void deleteAllByUser_Id(Long userId);

    void deleteByToken(String token);

}
