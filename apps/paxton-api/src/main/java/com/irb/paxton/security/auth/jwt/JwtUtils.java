package com.irb.paxton.security.auth.jwt;

import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Component;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.time.Instant;
import java.util.Collection;
import java.util.stream.Collectors;

import static com.irb.paxton.config.Constants.PAXTON_CLAIMS;

@Component
public class JwtUtils {

    @Value("${px.auth.token.expiry:900}")
    public long expiry;
    @Value("${px.auth.token.public.key}")
    RSAPublicKey key;
    @Value("${px.auth.token.private.key}")
    RSAPrivateKey priv;

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

    private String establishScope(Collection<? extends GrantedAuthority> authorities) {
        return authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(" "));
    }

    private JwtClaimsSet establishClaims(Authentication authentication) {
        Instant now = Instant.now();
        return JwtClaimsSet.builder()
                .issuer("PaxtonApp")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(expiry))
                .subject(authentication.getName())
                .claim(PAXTON_CLAIMS, establishScope(authentication.getAuthorities()))
                .build();
    }

    public String generateToken(Authentication authentication) {
        JwtClaimsSet claims = this.establishClaims(authentication);
        return this.jwtEncoder().encode(JwtEncoderParameters.from(claims)).getTokenValue();
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
}
