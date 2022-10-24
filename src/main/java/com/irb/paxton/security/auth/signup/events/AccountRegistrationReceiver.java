package com.irb.paxton.security.auth.signup.events;

import com.irb.paxton.mail.PaxtonMailService;
import com.irb.paxton.security.auth.signup.response.AccountRegistration;
import com.irb.paxton.security.auth.user.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;

@Component
@Slf4j
public class AccountRegistrationReceiver {

    @Autowired
    private PaxtonMailService mailService;

    @JmsListener(destination = "userAccountRegistrationQueue")
    public void sendConfirmationEmail(AccountRegistration accountRegistration) {
        User user = accountRegistration.getUser();
        String token = accountRegistration.getToken();
        String subject = "Complete your Paxton sign-up";
//        String confirmationUrl = accountRegistration.getRequestUrl() + "/auth/signup/confirmation?token=" + token;
        String confirmationUrl = "http://localhost:3000/app/signup/confirmation?token=" + token;
        Context context = new Context();

        context.setVariable("requestUrl", confirmationUrl);
        mailService.sendEmailByTemplate(user.getEmail(), subject, "mails/signup-confirmation/signup-confirm-email", context);
        log.info(String.format("Successfully sent account registration e-mail to user - %s", user.getUsername()));
    }
}
