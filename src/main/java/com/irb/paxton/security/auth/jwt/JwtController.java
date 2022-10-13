package com.irb.paxton.security.auth.jwt;

import com.irb.paxton.security.auth.user.dto.UserLoginDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.util.stream.Collectors;

@RestController
@Slf4j
public class JwtController {

    @Autowired
    JwtUtils jwtUtils;
    @Value("${px.auth.token.cookieName:PXSESSION}")
    private String accessTokenCookieName;
    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping(path = "/auth/token")
    public JwtResponse token(@Valid @RequestBody UserLoginDto userLoginDto, HttpServletResponse servletResponse) {
        UsernamePasswordAuthenticationToken authReq = new UsernamePasswordAuthenticationToken(userLoginDto.getUsername(), userLoginDto.getPassword());
        Authentication authentication = authenticationManager.authenticate(authReq);
        String jwtToken = jwtUtils.generateToken(authentication);
        log.info(String.format("Auth principal '%s' logged in by token, included authorities [%s]", authentication.getName(),
                authentication.getAuthorities().stream().map(Object::toString).collect(Collectors.joining(", "))));

        Cookie cookie = new Cookie(accessTokenCookieName, jwtToken);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        servletResponse.addCookie(cookie);

        return new JwtResponse(jwtToken);
    }
}
