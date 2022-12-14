package com.irb.paxton.security.auth.logout;

import com.irb.paxton.security.auth.device.UserDevice;
import com.irb.paxton.security.auth.jwt.JwtTokenProvider;
import com.irb.paxton.security.auth.jwt.token.RefreshTokenService;
import com.irb.paxton.security.auth.logout.event.OnUserLogoutSuccess;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserService;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import com.irb.paxton.security.response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.security.Principal;

import static com.irb.paxton.config.properties.ApplicationProperties.API_VERSION;
import static com.irb.paxton.utils.HttpUtils.getRequestIP;

@RestController
@RequestMapping(path = "api/" + API_VERSION)
public class SignOutController {

    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @Autowired
    JmsTemplate jmsTemplate;

    @Autowired
    private UserService userService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @PostMapping(path = "/users/logout")
    public ResponseEntity<?> signOut(HttpServletRequest request, Principal principal, @RequestHeader(value = HttpHeaders.USER_AGENT) String userAgent) {
        String token = jwtTokenProvider.resolveToken(request);
        User user = this.userService.findByUsername(principal.getName()).orElseThrow(() -> new UserNotFoundException("User not found"));

        ResponseCookie jwtRefreshCookie = jwtTokenProvider.getCleanJwtRefreshCookie();

        refreshTokenService.deleteByUserId(user.getId());
        jmsTemplate.convertAndSend("userAuthLogout",
                new OnUserLogoutSuccess(user.getUsername(), token, new UserDevice(getRequestIP(request), userAgent, user))
        );

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtRefreshCookie.toString())
                .header(HttpHeaders.AUTHORIZATION, "")
                .body(new ApiResponse("Successfully signed out", 200));
    }
}
