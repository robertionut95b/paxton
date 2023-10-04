package com.irb.paxton.security.auth.token;

import com.irb.paxton.security.auth.user.User;

public interface UserAwareToken {

    User getUser();
}
