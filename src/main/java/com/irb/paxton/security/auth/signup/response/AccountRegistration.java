package com.irb.paxton.security.auth.signup.response;

import com.irb.paxton.security.auth.user.User;
import lombok.*;

import java.io.Serial;
import java.io.Serializable;

@AllArgsConstructor
@Getter
@Setter
@Builder
@NoArgsConstructor
public class AccountRegistration implements Serializable {

    @Serial
    private static final long serialVersionUID = -6699058277939881368L;

    private User user;

    private String token;

    private String requestUrl;
}
