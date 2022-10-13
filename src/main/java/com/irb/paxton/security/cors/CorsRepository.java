package com.irb.paxton.security.cors;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CorsRepository extends JpaRepository<CorsRecord, Long> {
    Optional<CorsRecord> findByUrl(String url);
}
