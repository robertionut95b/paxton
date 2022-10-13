package com.irb.paxton.security.auth.forgot.response;

import com.irb.paxton.security.auth.user.User;
import lombok.*;

import java.io.Serial;
import java.io.Serializable;

@AllArgsConstructor
@Getter
@Setter
@Builder
@NoArgsConstructor
public class ForgotPasswordRequest implements Serializable {
    @Serial
    private static final long serialVersionUID = -3344363361571335495L;

    private User user;

    private String token;

    private String requestUrl;
}
