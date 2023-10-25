package com.irb.paxton.core.activity.exception;

import com.irb.paxton.exceptions.handler.common.AbstractNotFoundException;

import java.io.Serial;

public class ActivitySectorNotFoundException extends AbstractNotFoundException {

    @Serial
    private static final long serialVersionUID = -8867336788992149667L;

    public ActivitySectorNotFoundException() {
    }

    public ActivitySectorNotFoundException(String message) {
        super(message);
    }

    public ActivitySectorNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public ActivitySectorNotFoundException(Throwable cause) {
        super(cause);
    }

    public ActivitySectorNotFoundException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
