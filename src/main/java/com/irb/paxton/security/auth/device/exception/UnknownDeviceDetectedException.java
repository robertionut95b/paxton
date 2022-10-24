package com.irb.paxton.security.auth.device.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.io.Serial;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class UnknownDeviceDetectedException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 4962741367234267847L;
    private Long deviceId;

    public UnknownDeviceDetectedException(Long deviceId, String message) {
        super(message);
        this.deviceId = deviceId;
    }

    public UnknownDeviceDetectedException(Long deviceId, String message, Throwable cause) {
        super(message, cause);
        this.deviceId = deviceId;
    }

    public Long getDeviceId() {
        return deviceId;
    }
}
