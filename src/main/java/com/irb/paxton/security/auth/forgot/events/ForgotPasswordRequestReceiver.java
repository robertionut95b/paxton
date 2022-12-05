package com.irb.paxton.security.auth.forgot.events;

import com.irb.paxton.config.properties.FrontendProperties;
import com.irb.paxton.mail.PaxtonMailService;
import com.irb.paxton.security.auth.forgot.response.ForgotPasswordRequest;
import com.irb.paxton.security.auth.user.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;

@Component
@Slf4j
public class ForgotPasswordRequestReceiver {

    @Autowired
    private PaxtonMailService mailService;

    @Autowired
    private FrontendProperties frontendProperties;

    @JmsListener(destination = "userForgotRegistrationQueue")
    public void sendResetPasswordEmail(ForgotPasswordRequest forgotPasswordRequest) {
        User user = forgotPasswordRequest.getUser();
        String token = forgotPasswordRequest.getToken();
        String subject = "Recover your Paxton password";
        String confirmationUrl = frontendProperties.getFrontendUrl() + "/app/forgot-password/reset?token=" + token;

        Context context = new Context();
        context.setVariable("requestUrl", confirmationUrl);
        mailService.sendEmailByTemplate(user.getEmail(), subject, "mails/password-reset/password-reset-email", context);
        log.info(String.format("Successfully sent password recovery request e-mail to user - %s", user.getUsername()));
    }
}
