package com.irb.paxton.security.auth.jwt.token.exceptions;

import com.irb.paxton.exceptions.handler.common.AbstractNotFoundException;

import java.io.Serial;

public class TokenRefreshNotFoundException extends AbstractNotFoundException {

    @Serial
    private static final long serialVersionUID = -8397600663923557725L;

    public TokenRefreshNotFoundException(String message) {
        super(message);
    }
}
