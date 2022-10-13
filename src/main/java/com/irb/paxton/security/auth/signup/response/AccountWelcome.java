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
public class AccountWelcome implements Serializable {

    @Serial
    private static final long serialVersionUID = 3546651496646552267L;

    private User user;
}
