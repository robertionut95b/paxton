package com.irb.paxton.security.auth.token;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.UUID;

@NoRepositoryBean
public interface TokenRepository<T extends Token> extends JpaRepository<Token, Long> {

    T findById(UUID id);
}
