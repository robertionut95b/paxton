package com.irb.paxton.security.auth.jwt.token.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.io.Serial;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class TokenRefreshNotFoundException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = -8397600663923557725L;

    public TokenRefreshNotFoundException(String message) {
        super(message);
    }

    public TokenRefreshNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
