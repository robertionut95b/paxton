package com.irb.paxton.security.auth.logout;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

@RestController
public class TokenLogout {

    @Value("${px.auth.token.cookieName:PXSESSION}")
    private String accessTokenCookieName;

    @GetMapping(path = "/auth/token/logout")
    private void clearTokenCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie(accessTokenCookieName, null);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }
}
