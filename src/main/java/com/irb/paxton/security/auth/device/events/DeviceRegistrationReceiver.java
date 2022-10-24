package com.irb.paxton.security.auth.device.events;

import com.irb.paxton.mail.PaxtonMailService;
import com.irb.paxton.security.auth.device.UserDevice;
import com.irb.paxton.security.auth.user.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;

@Component
@Slf4j
public class DeviceRegistrationReceiver {

    @Autowired
    private PaxtonMailService mailService;

    @JmsListener(destination = "userDeviceRegistrationQueue")
    public void sendDeviceRegistrationEmail(UserDevice userDeviceRegistration) {
        User user = userDeviceRegistration.getUser();
        String subject = "A new login device detected";
        Context context = new Context();

        context.setVariable("device", userDeviceRegistration.getAgent());
        context.setVariable("ipAddress", userDeviceRegistration.getIpAddress());
        context.setVariable("requestUrl", "#");
        mailService.sendEmailByTemplate(user.getEmail(), subject, "mails/devices/new-device-detected-email", context);
        log.info(String.format("Successfully sent device detection e-mail to user - %s", user.getUsername()));
    }
}
