package com.irb.paxton.exceptions.handler;

import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.util.ErrorHandler;

@Slf4j
public class GlobalJmsErrorHandler implements ErrorHandler {

    @Override
    public void handleError(@NotNull Throwable t) {
        if (t.getMessage().contains("com.sun.mail.util.MailConnectException: Couldn't connect to host")) {
            log.error("Error occurred in events listener, could not connect to SMTP server");
        } else {
            log.error(t.getMessage(), t);
        }
    }
}
