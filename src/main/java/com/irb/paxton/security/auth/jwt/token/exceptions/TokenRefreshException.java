package com.irb.paxton.security.auth.jwt.token.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.io.Serial;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class TokenRefreshException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = -8397600663923557725L;

    public TokenRefreshException(String message) {
        super(message);
    }

    public TokenRefreshException(String message, Throwable cause) {
        super(message, cause);
    }
}
