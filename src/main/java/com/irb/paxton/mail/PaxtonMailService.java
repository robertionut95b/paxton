package com.irb.paxton.mail;

import com.irb.paxton.config.properties.MailProperties;
import jakarta.annotation.PostConstruct;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.UnsupportedEncodingException;
import java.util.Date;

import static com.irb.paxton.utils.SocketUtils.pingHost;

@Service
@Slf4j
public class PaxtonMailService implements EmailService {

    private final MailProperties mailProperties;

    private final JavaMailSender emailSender;

    private final TemplateEngine templateEngine;

    public PaxtonMailService(MailProperties mailProperties, JavaMailSender emailSender, TemplateEngine templateEngine) {
        this.mailProperties = mailProperties;
        this.emailSender = emailSender;
        this.templateEngine = templateEngine;
    }

    @PostConstruct
    public void checkConnection() {
        if (!pingHost(mailProperties.getSmtpHost(), mailProperties.getSmtpPort(), 3000)) {
            log.error("Smtp connection refused, please check application properties. This connection is required for user management activities");
        }
    }

    public void sendEmail(String to, String subject, String body) {
        MimeMessage msg = emailSender.createMimeMessage();
        try {
            msg.addHeader("Content-type", "text/HTML; charset=UTF-8");
            msg.addHeader("format", "flowed");
            msg.addHeader("Content-Transfer-Encoding", "8bit");
            msg.setFrom(new InternetAddress(mailProperties.getEmailAddress(), mailProperties.getEmailFrom()));
            msg.setReplyTo(InternetAddress.parse(mailProperties.getEmailFrom(), false));
            msg.setSubject(subject, "UTF-8");
            msg.setText(body, "UTF-8");
            msg.setSentDate(new Date());
            msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to, false));
            emailSender.send(msg);
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error(e.getLocalizedMessage(), e);
            throw new RuntimeException(e);
        }
    }

    public void sendEmailByTemplate(String to, String subject, String templatePath, Context context) {
        String process = templateEngine.process(templatePath, context);
        MimeMessage mimeMessage = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage);
        try {
            helper.setSubject(subject);
            helper.setText(process, true);
            helper.setTo(to);
            helper.setFrom(new InternetAddress(mailProperties.getEmailAddress(), mailProperties.getEmailFrom()));
            helper.setSentDate(new Date());
            emailSender.send(mimeMessage);
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error(e.getLocalizedMessage(), e);
            throw new RuntimeException(e);
        }
    }
}
