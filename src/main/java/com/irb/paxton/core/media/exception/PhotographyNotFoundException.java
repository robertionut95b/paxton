package com.irb.paxton.core.media.exception;

import com.irb.paxton.exceptions.handler.common.AbstractNotFoundException;

public class PhotographyNotFoundException extends AbstractNotFoundException {

    public PhotographyNotFoundException(String message) {
        super(message);
    }

    public PhotographyNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
