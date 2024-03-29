package com.irb.paxton.security.auth.token.exceptions;

import com.irb.paxton.exceptions.handler.common.PaxtonRuntimeException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.io.Serial;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class TokenNotFoundException extends PaxtonRuntimeException {

    @Serial
    private static final long serialVersionUID = 1436420380736841810L;

    public TokenNotFoundException(String message) {
        super(message);
    }

    public TokenNotFoundException(String message, Throwable err) {
        super(message, err);
    }
}
