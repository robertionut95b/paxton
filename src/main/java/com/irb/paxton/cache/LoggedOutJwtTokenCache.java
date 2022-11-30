package com.irb.paxton.cache;

import com.irb.paxton.security.auth.jwt.JwtTokenProvider;
import com.irb.paxton.security.auth.logout.event.OnUserLogoutSuccess;
import lombok.extern.slf4j.Slf4j;
import net.jodah.expiringmap.ExpiringMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Date;
import java.util.concurrent.TimeUnit;

@Component
@Slf4j
public class LoggedOutJwtTokenCache {

    private final ExpiringMap<String, OnUserLogoutSuccess> tokenEventMap;

    private final JwtTokenProvider jwtTokenProvider;

    @Autowired
    public LoggedOutJwtTokenCache(@Value("${px.app.cache.logoutToken.maxSize:100}") int maxSize, JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.tokenEventMap = ExpiringMap.builder()
                .variableExpiration()
                .maxSize(maxSize)
                .build();
    }

    public void markLogoutEventForToken(OnUserLogoutSuccess event) {
        String token = event.getToken();
        if (tokenEventMap.containsKey(token)) {
            log.info(String.format("Log out token for user [%s] is already present in the cache", event.getUser()));

        } else {
            Date tokenExpiryDate = Date.from(jwtTokenProvider.getExpirationDateFromToken(token));
            long ttlForToken = getTTLForToken(tokenExpiryDate);
            log.info(String.format("Logout token cache set for [%s] with a TTL of [%s] seconds. Token is due expiry at [%s]", event.getUser(), ttlForToken, tokenExpiryDate));
            tokenEventMap.put(token, event, ttlForToken, TimeUnit.SECONDS);
        }
    }

    public OnUserLogoutSuccess getLogoutEventForToken(String token) {
        return tokenEventMap.get(token);
    }

    private long getTTLForToken(Date date) {
        long secondAtExpiry = date.toInstant().getEpochSecond();
        long secondAtLogout = Instant.now().getEpochSecond();
        return Math.max(0, secondAtExpiry - secondAtLogout);
    }

    public void validateTokenIsNotForALoggedOutDevice(String jwtToken) {
        OnUserLogoutSuccess previouslyLoggedOutEvent = this.getLogoutEventForToken(jwtToken);
        if (previouslyLoggedOutEvent != null) {
            String userName = previouslyLoggedOutEvent.getUser();
            LocalDate logoutEventDate = previouslyLoggedOutEvent.getEventTime();
            String errorMessage = String.format("Token corresponds to an already logged out user [%s] at [%s]. Please login again", userName, logoutEventDate);
            throw new AccessDeniedException(errorMessage);
        }
    }
}
