package com.irb.paxton.mail.exception;

import java.io.Serial;

public class SmtpConnectionRefused extends Exception {

    @Serial
    private static final long serialVersionUID = -5295498757106865788L;

    public SmtpConnectionRefused(String message) {
        super(message);
    }

    public SmtpConnectionRefused(String message, Throwable cause) {
        super(message, cause);
    }
}
