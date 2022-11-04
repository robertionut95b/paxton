package com.irb.paxton.security.auth.logout.event;

import com.irb.paxton.cache.LoggedOutJwtTokenCache;
import com.irb.paxton.security.auth.device.UserDevice;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class OnUserLogoutReceiver {

    @Autowired
    private LoggedOutJwtTokenCache tokenCache;

    @JmsListener(destination = "userAuthLogout")
    public void logoutUser(OnUserLogoutSuccess onUserLogoutSuccess) {
        if (onUserLogoutSuccess != null) {
            UserDevice userDevice = onUserLogoutSuccess.getUserDevice();
            log.info(String.format("Log out success event received for user [%s] for device [%s]", onUserLogoutSuccess.getUser(), userDevice.toString()));
            tokenCache.markLogoutEventForToken(onUserLogoutSuccess);
        }
    }
}
