package com.irb.paxton.security.auth.logout.event;

import com.irb.paxton.security.auth.device.UserDevice;
import lombok.Data;

import java.time.LocalDate;

@Data
public class OnUserLogoutSuccess {

    private final String user;

    private final String token;

    private final UserDevice userDevice;

    private final LocalDate eventTime = LocalDate.now();

}
