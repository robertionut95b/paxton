package com.irb.paxton.core.search.exceptions;

import com.irb.paxton.exceptions.handler.common.PaxtonRuntimeException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST)
public class InvalidSearchSyntaxException extends PaxtonRuntimeException {

    public InvalidSearchSyntaxException() {
        super();
    }

    public InvalidSearchSyntaxException(String message) {
        super(message);
    }

    public InvalidSearchSyntaxException(String message, Throwable cause) {
        super(message, cause);
    }

    public InvalidSearchSyntaxException(Throwable cause) {
        super(cause);
    }

    protected InvalidSearchSyntaxException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
