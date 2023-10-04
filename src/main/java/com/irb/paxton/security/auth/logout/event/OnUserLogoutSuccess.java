package com.irb.paxton.security.auth.logout.event;

import com.irb.paxton.security.auth.device.UserDevice;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OnUserLogoutSuccess {

    private LocalDate eventTime = LocalDate.now();

    private String user;

    private String token;

    private UserDevice userDevice;

    public OnUserLogoutSuccess(String user, String token, UserDevice userDevice) {
        this.user = user;
        this.token = token;
        this.userDevice = userDevice;
    }
}
