package com.irb.paxton.core.study.exception;

import com.irb.paxton.exceptions.handler.common.AbstractNotFoundException;

public class StudyNotFoundException extends AbstractNotFoundException {

    public StudyNotFoundException() {
    }

    public StudyNotFoundException(String message) {
        super(message);
    }

    public StudyNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public StudyNotFoundException(Throwable cause) {
        super(cause);
    }

    public StudyNotFoundException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
