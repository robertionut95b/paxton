package com.irb.paxton.mail;

import org.thymeleaf.context.Context;

public interface EmailService {

    void sendEmail(String to, String subject, String body);

    void sendEmailByTemplate(String to, String subject, String templatePath, Context context);
}
