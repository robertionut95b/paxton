package com.irb.paxton.core.messaging.exceptions;

import com.irb.paxton.exceptions.handler.common.AbstractNotFoundException;

public class ChatNotFoundException extends AbstractNotFoundException {

    public ChatNotFoundException() {
    }

    public ChatNotFoundException(String message) {
        super(message);
    }

    public ChatNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public ChatNotFoundException(Throwable cause) {
        super(cause);
    }

    public ChatNotFoundException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
