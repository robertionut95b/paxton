package com.irb.paxton.core.profile.experience.exception;

import com.irb.paxton.exceptions.handler.common.AbstractNotFoundException;

public class ExperienceNotFoundException extends AbstractNotFoundException {

    public ExperienceNotFoundException() {
    }

    public ExperienceNotFoundException(String message) {
        super(message);
    }

    public ExperienceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public ExperienceNotFoundException(Throwable cause) {
        super(cause);
    }

    public ExperienceNotFoundException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
