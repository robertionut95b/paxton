package com.irb.paxton.security.auth.jwt;

import com.irb.paxton.config.properties.AuthenticationProperties;
import com.irb.paxton.config.properties.JwtProperties;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.utils.AuthoritiesUtils;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

import javax.annotation.PostConstruct;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.security.Key;
import java.time.Duration;
import java.time.Instant;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

import static com.irb.paxton.config.properties.ApplicationProperties.API_VERSION;

@Component
@Slf4j
public class JwtTokenProvider {

    @Autowired
    private AuthenticationProperties authenticationProperties;

    @Autowired
    private JwtProperties jwtProperties;

    private Key key;

    public Jws<Claims> decodeToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
    }

    @PostConstruct
    private void initializeProvider() {
        this.key = getSigningKey();
    }

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtProperties.getSecret());
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateTokenFromUserDetails(UserDetails userDetails) {
        Instant expiryDate = Instant.now().plusSeconds(jwtProperties.getAccessTokenExpiryInSeconds());
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
        Instant expiryDate = Instant.now().plusSeconds(jwtProperties.getAccessTokenExpiryInSeconds());
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
        Instant expiryDate = Instant.now().plusSeconds(jwtProperties.getRefreshTokenExpiryInSeconds());
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
                .collect(Collectors.joining(","));
    }

    public Authentication getAuthentication(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody();
        Collection<? extends GrantedAuthority> authorities = Arrays.stream(claims.get("authorities").toString().split(","))
                .map(SimpleGrantedAuthority::new).toList();
        org.springframework.security.core.userdetails.User principal = new org.springframework.security.core.userdetails.User(claims.getSubject(), "", authorities);
        return new UsernamePasswordAuthenticationToken(principal, "", authorities);
    }

    public ResponseCookie generateRefreshJwtCookie(String refreshToken) {
        return generateCookie(jwtProperties.getJwtRefreshCookieName(), refreshToken, "api/" + API_VERSION + "/auth/refreshtoken");
    }

    public String getUsernameFromToken(String token) {
        return decodeToken(token).getBody().getSubject();
    }

    public Instant getExpirationDateFromToken(String token) {
        return decodeToken(token).getBody().getExpiration().toInstant();
    }

    public ResponseCookie getCleanJwtRefreshCookie() {
        return ResponseCookie.from(jwtProperties.getJwtRefreshCookieName(), null).path("/auth/refreshtoken").maxAge(0).build();
    }

    private ResponseCookie generateCookie(String name, String value, String path) {
        return ResponseCookie.from(name, value).path(path).maxAge(24 * 60 * 60).httpOnly(true).build();
    }

    public String getJwtRefreshFromCookies(HttpServletRequest request) {
        return getCookieValueByName(request, jwtProperties.getJwtRefreshCookieName());
    }

    public String resolveToken(HttpServletRequest req) {
        String bearerToken = req.getHeader(authenticationProperties.getHeaderName());
        return bearerToken != null && bearerToken.startsWith(authenticationProperties.getHeaderPrefix()) ? bearerToken.substring(7) : null;
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
        return jwtProperties.getRefreshTokenExpiryInSeconds();
    }
}
