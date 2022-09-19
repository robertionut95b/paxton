package com.irb.paxton.security.auth.jwt;

import lombok.NoArgsConstructor;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;

import static com.irb.paxton.config.Constants.PAXTON_CLAIMS;

@NoArgsConstructor
public class PaxtonJwtAuthenticationConverter {
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        // create a custom JWT converter to map the roles from the token as granted authorities
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        jwtGrantedAuthoritiesConverter.setAuthoritiesClaimName(PAXTON_CLAIMS);
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }
}
