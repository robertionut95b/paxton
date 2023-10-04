package com.irb.paxton.security.auth.token.exceptions;

import com.irb.paxton.exceptions.handler.common.PaxtonRuntimeException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.io.Serial;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class TokenExpiredException extends PaxtonRuntimeException {

    @Serial
    private static final long serialVersionUID = -88877167501326769L;

    public TokenExpiredException(String message) {
        super(message);
    }

    public TokenExpiredException(String message, Throwable err) {
        super(message, err);
    }
}
