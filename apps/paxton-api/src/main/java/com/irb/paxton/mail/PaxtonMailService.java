package com.irb.paxton.mail;

import com.irb.paxton.mail.exception.SmtpConnectionRefused;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import javax.annotation.PostConstruct;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.util.Date;

import static com.irb.paxton.utils.SocketUtils.pingHost;

@Service
@Slf4j
public class PaxtonMailService implements EmailService {

    @Autowired
    private JavaMailSender emailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${px.smtp.emailAddress}")
    private String emailFrom;

    @Value("${px.smtp.emailFrom}")
    private String emailPersonal;

    @Value("${spring.mail.host}")
    private String smtpHost;

    @Value("${spring.mail.port}")
    private int smtpPort;

    @PostConstruct
    public void checkConnection() throws SmtpConnectionRefused {
        if (!pingHost(smtpHost, smtpPort, 3000)) {
            log.error("Smtp connection refused, please check application properties. This connection is required for user management activities");
        }
    }

    public void sendEmail(String to, String subject, String body) {
        MimeMessage msg = emailSender.createMimeMessage();
        try {
            msg.addHeader("Content-type", "text/HTML; charset=UTF-8");
            msg.addHeader("format", "flowed");
            msg.addHeader("Content-Transfer-Encoding", "8bit");
            msg.setFrom(new InternetAddress(emailFrom, emailPersonal));
            msg.setReplyTo(InternetAddress.parse(emailFrom, false));
            msg.setSubject(subject, "UTF-8");
            msg.setText(body, "UTF-8");
            msg.setSentDate(new Date());
            msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to, false));
            emailSender.send(msg);
            log.info(String.format("A registration confirmation email was sent to the user's address = %s", to));
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
            helper.setFrom(new InternetAddress(emailFrom, emailPersonal));
            helper.setSentDate(new Date());
            emailSender.send(mimeMessage);
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error(e.getLocalizedMessage(), e);
            throw new RuntimeException(e);
        }
    }
}
