package com.irb.paxton.config.storage;

import com.irb.paxton.exceptions.handler.common.PaxtonRuntimeException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class MinioConfigurationException extends PaxtonRuntimeException {

    public MinioConfigurationException() {
    }

    public MinioConfigurationException(String message) {
        super(message);
    }

    public MinioConfigurationException(String message, Throwable cause) {
        super(message, cause);
    }

    public MinioConfigurationException(Throwable cause) {
        super(cause);
    }

    public MinioConfigurationException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
