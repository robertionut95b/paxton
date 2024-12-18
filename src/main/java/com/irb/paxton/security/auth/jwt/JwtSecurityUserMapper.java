package com.irb.paxton.security.auth.jwt;

import com.irb.paxton.security.auth.user.User;
import org.springframework.security.oauth2.jwt.Jwt;

public class JwtSecurityUserMapper {

    public static User fromJwtToUser(Jwt jwt) {
        return new User(jwt.getClaimAsString("email"),
                jwt.getClaimAsString("preferred_username"),
                jwt.getClaimAsString("given_name"),
                jwt.getClaimAsString("family_name"));
    }
}
