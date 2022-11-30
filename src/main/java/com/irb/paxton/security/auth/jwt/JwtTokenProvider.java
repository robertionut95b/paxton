package com.irb.paxton.security.auth.jwt;

import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.utils.AuthoritiesUtils;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

import javax.annotation.PostConstruct;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.security.Key;
import java.time.Duration;
import java.time.Instant;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

import static com.irb.paxton.config.ApplicationProperties.API_VERSION;

@Component
@Slf4j
public class JwtTokenProvider {

    @Value("${px.auth.token.expiry:900}")
    public long expiry;

    @Value("${px.auth.token.jwt-secret}")
    String jwtSecret;

    @Value("${px.auth.token.refreshCookieName:PX_REFRESH_TOKEN}")
    String jwtRefreshCookieName;

    @Value("${px.auth.token.expiryRefresh:3600}")
    private Long refreshExpiry;

    private Key key;

    public Jws<Claims> decodeToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
    }

    @PostConstruct
    private void initializeProvider() {
        this.key = getSigningKey();
    }

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateTokenFromUserDetails(UserDetails userDetails) {
        Instant expiryDate = Instant.now().plusSeconds(expiry);
        return Jwts.builder()
                .setIssuer("paxton")
                .setIssuedAt(Date.from(Instant.now()))
                .setExpiration(Date.from(expiryDate))
                .setSubject(userDetails.getUsername())
                .claim("authorities", establishScope(userDetails.getAuthorities()))
                .signWith(this.key)
                .compact();
    }

    public String generateTokenFromUser(User user) {
        Instant expiryDate = Instant.now().plusSeconds(expiry);
        return Jwts.builder()
                .setIssuer("paxton")
                .setIssuedAt(Date.from(Instant.now()))
                .setExpiration(Date.from(expiryDate))
                .setSubject(user.getUsername())
                .claim("authorities", establishScope(AuthoritiesUtils.getAuthorities(user.getRoles())))
                .signWith(this.key)
                .compact();
    }

    public String generateRefreshTokenFromUser() {
        Instant expiryDate = Instant.now().plusSeconds(refreshExpiry);
        return Jwts.builder()
                .setIssuer("paxton")
                .setIssuedAt(Date.from(Instant.now()))
                .setExpiration(Date.from(expiryDate))
                .signWith(this.key)
                .compact();
    }

    private String establishScope(Collection<? extends GrantedAuthority> authorities) {
        return authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(" "));
    }

    public ResponseCookie generateRefreshJwtCookie(String refreshToken) {
        return generateCookie(jwtRefreshCookieName, refreshToken, "api/" + API_VERSION + "/auth/refreshtoken");
    }

    public String getUsernameFromToken(String token) {
        return decodeToken(token).getBody().getSubject();
    }

    public Instant getExpirationDateFromToken(String token) {
        return decodeToken(token).getBody().getExpiration().toInstant();
    }

    public ResponseCookie getCleanJwtRefreshCookie() {
        return ResponseCookie.from(jwtRefreshCookieName, null).path("/auth/refreshtoken").maxAge(0).build();
    }

    private ResponseCookie generateCookie(String name, String value, String path) {
        return ResponseCookie.from(name, value).path(path).maxAge(24 * 60 * 60).httpOnly(true).build();
    }

    public String getJwtRefreshFromCookies(HttpServletRequest request) {
        return getCookieValueByName(request, jwtRefreshCookieName);
    }

    public String resolveToken(HttpServletRequest req) {
        String bearerToken = req.getHeader("Authorization");
        return bearerToken != null && bearerToken.startsWith("Bearer ") ? bearerToken.substring(7) : null;
    }

    public Long getExpiresAtFromTokenAsLong(String token) {
        return Duration.between(Instant.now(), this.getExpirationDateFromToken(token)).toMillis();
    }

    private String getCookieValueByName(HttpServletRequest request, String name) {
        Cookie cookie = WebUtils.getCookie(request, name);
        return cookie != null ? cookie.getValue() : null;
    }

    public Key getKey() {
        return key;
    }

    public Long getRefreshExpiry() {
        return refreshExpiry;
    }
}
