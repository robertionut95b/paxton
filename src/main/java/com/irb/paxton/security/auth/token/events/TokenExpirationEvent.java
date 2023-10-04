package com.irb.paxton.security.auth.token.events;

import com.irb.paxton.security.auth.token.TokenType;
import com.irb.paxton.security.auth.user.User;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;

@Data
@AllArgsConstructor
public class TokenExpirationEvent implements Serializable {

    private String token;

    private User user;

    private TokenType tokenType;
}
