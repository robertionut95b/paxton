package com.irb.paxton.security.auth;

import com.irb.paxton.security.AuthenticationService;
import com.irb.paxton.security.SecurityUtils;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserService;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.NotImplementedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserService userService;

    public AuthenticationServiceImpl(UserService userService) {
        this.userService = userService;
    }

    @Override
    public User getUserByUsername(String username) {
        return null;
    }

    public Authentication identifyUserInToken(String token) {
        throw new NotImplementedException();
    }

    @Override
    public User getCurrentUserFromSecurityContext() throws AuthenticationException, UserNotFoundException {
        String user = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return userService
                .findByUsername(user)
                .orElseThrow(() -> new UserNotFoundException("User [%s] does not exist".formatted(user)));
    }
}
