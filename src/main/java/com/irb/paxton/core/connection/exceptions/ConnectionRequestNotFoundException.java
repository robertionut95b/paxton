package com.irb.paxton.core.connection.exceptions;

import com.irb.paxton.exceptions.handler.common.AbstractNotFoundException;

public class ConnectionRequestNotFoundException extends AbstractNotFoundException {

    public ConnectionRequestNotFoundException() {
    }

    public ConnectionRequestNotFoundException(String message) {
        super(message);
    }

    public ConnectionRequestNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public ConnectionRequestNotFoundException(Throwable cause) {
        super(cause);
    }

    public ConnectionRequestNotFoundException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
