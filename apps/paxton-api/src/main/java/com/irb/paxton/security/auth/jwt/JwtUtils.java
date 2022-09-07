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

    @Value("${px.jwt.public.key}")
    RSAPublicKey key;
    @Value("${px.jwt.private.key}")
    RSAPrivateKey priv;

    @Value("${px.jwt.validity:3600}")
    private long expiry;

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
}
