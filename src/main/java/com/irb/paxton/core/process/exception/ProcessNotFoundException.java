package com.irb.paxton.core.process.exception;

import com.irb.paxton.exceptions.handler.common.AbstractNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.io.Serial;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ProcessNotFoundException extends AbstractNotFoundException {
    @Serial
    private static final long serialVersionUID = -8403733063791722770L;

    public ProcessNotFoundException() {
    }

    public ProcessNotFoundException(String message) {
        super(message);
    }

    public ProcessNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public ProcessNotFoundException(Throwable cause) {
        super(cause);
    }

    public ProcessNotFoundException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
