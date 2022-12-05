package com.irb.paxton.security.auth.jwt;

import com.irb.paxton.cache.LoggedOutJwtTokenCache;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class JwtTokenValidator {

    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @Autowired
    private LoggedOutJwtTokenCache tokenCache;

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(jwtTokenProvider.getKey()).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            if (e instanceof ExpiredJwtException) log.debug("{}", e.getMessage());
            else
                log.error("Invalid token : {}", e.getMessage());
        }
        // check if token is not marked in the cache
        this.tokenCache.validateTokenIsNotForALoggedOutDevice(token);
        return false;
    }
}
