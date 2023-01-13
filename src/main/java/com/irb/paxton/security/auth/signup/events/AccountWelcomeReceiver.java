package com.irb.paxton.security.auth.signup.events;

import com.irb.paxton.mail.PaxtonMailService;
import com.irb.paxton.security.auth.signup.response.AccountWelcome;
import com.irb.paxton.security.auth.user.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;

@Component
@Slf4j
public class AccountWelcomeReceiver {

    @Autowired
    private PaxtonMailService mailService;

    @JmsListener(destination = "userAccountWelcomeQueue")
    public void sendWelcomeEmail(AccountWelcome accountWelcome) {
        Context context = new Context();
        User user = accountWelcome.getUser();
        context.setVariable("requestUrl", "http://localhost:8080/");
        context.setVariable("userName", user.getFirstName() != null ? user.getFirstName() : user.getUsername());
        mailService.sendEmailByTemplate(user.getEmail(), "Welcome to Paxton!", "mails/signup-confirmation/welcome-email", context);
        log.info(String.format("Sent account welcome e-mail to user - %s", user.getUsername()));
    }
}
