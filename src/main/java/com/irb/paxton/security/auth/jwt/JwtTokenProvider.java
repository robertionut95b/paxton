package com.irb.paxton.security.auth.jwt;

import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.utils.AuthoritiesUtils;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.time.Duration;
import java.time.Instant;
import java.util.Collection;
import java.util.stream.Collectors;

import static com.irb.paxton.config.ApplicationProperties.API_VERSION;

@Component
public class JwtTokenProvider {

    @Value("${px.auth.token.expiry:900}")
    public long expiry;
    @Value("${px.auth.token.public.key}")
    RSAPublicKey key;
    @Value("${px.auth.token.private.key}")
    RSAPrivateKey priv;
    @Value("${px.auth.token.refreshCookieName:PX_REFRESH_TOKEN}")
    String jwtRefreshCookieName;
    @Value("${px.auth.token.expiryRefresh:3600}")
    private Long refreshExpiry;

    @Bean
    JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withPublicKey(this.key).build();
    }

    @Bean
    JwtEncoder jwtEncoder() {
        JWK jwk = new RSAKey.Builder(this.key).privateKey(this.priv).build();
        JWKSource<SecurityContext> jwks = new ImmutableJWKSet<>(new JWKSet(jwk));
        return new NimbusJwtEncoder(jwks);
    }

    public String generateTokenFromUserDetails(UserDetails userDetails) {
        Instant now = Instant.now();
        JwtClaimsSet jwtClaimsSet = JwtClaimsSet.builder()
                .issuer("paxton")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(expiry))
                .subject(userDetails.getUsername())
                .claim("authorities", establishScope(userDetails.getAuthorities()))
                .build();
        return this.jwtEncoder().encode(JwtEncoderParameters.from(jwtClaimsSet)).getTokenValue();
    }

    public String generateTokenFromUser(User user) {
        Instant now = Instant.now();
        JwtClaimsSet jwtClaimsSet = JwtClaimsSet.builder()
                .issuer("paxton")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(expiry))
                .subject(user.getUsername())
                .claim("authorities", establishScope(AuthoritiesUtils.getAuthorities(user.getRoles())))
                .build();
        return this.jwtEncoder().encode(JwtEncoderParameters.from(jwtClaimsSet)).getTokenValue();
    }

    public String generateRefreshTokenFromUser(UserDetails userDetails) {
        Instant now = Instant.now();
        JwtClaimsSet jwtClaimsSet = JwtClaimsSet.builder()
                .issuer("paxton")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(expiry))
                .subject(userDetails.getUsername())
                .build();
        return this.jwtEncoder().encode(JwtEncoderParameters.from(jwtClaimsSet)).getTokenValue();
    }

    private String establishScope(Collection<? extends GrantedAuthority> authorities) {
        return authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(" "));
    }

    public ResponseCookie generateRefreshJwtCookie(String refreshToken) {
        return generateCookie(jwtRefreshCookieName, refreshToken, "api/" + API_VERSION + "/auth/refreshtoken");
    }

    public String getUsernameFromToken(String token) throws BadJwtException {
        return decodeToken(token).getSubject();
    }

    public Instant getExpirationDateFromToken(String token) throws BadJwtException {
        return decodeToken(token).getExpiresAt();
    }

    public Jwt decodeToken(String token) {
        return jwtDecoder().decode(token);
    }

    private Boolean isTokenExpired(String token) {
        final Instant expiration = getExpirationDateFromToken(token);
        return expiration.isBefore(Instant.now());
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        String username = getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
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
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    public Instant getExpiresAtFromToken(String token) {
        Jwt jwt = decodeToken(token);
        return jwt.getExpiresAt();
    }

    public Long getExpiresAtFromTokenAsLong(String token) {
        Jwt jwt = decodeToken(token);
        return Duration.between(Instant.now(), jwt.getExpiresAt()).toMillis();
    }

    private String getCookieValueByName(HttpServletRequest request, String name) {
        Cookie cookie = WebUtils.getCookie(request, name);
        if (cookie != null) {
            return cookie.getValue();
        } else {
            return null;
        }
    }
}
