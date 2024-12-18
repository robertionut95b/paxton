package com.irb.paxton.security;

import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;

public interface AuthenticationService {

    User getUserByUsername(String username);

    Authentication identifyUserInToken(String token);

    User getCurrentUserFromSecurityContext() throws AuthenticationException, UserNotFoundException;
}
