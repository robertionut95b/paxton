package com.irb.paxton.security.auth.login;

import com.irb.paxton.security.auth.device.UserDevice;
import com.irb.paxton.security.auth.device.UserDeviceService;
import com.irb.paxton.security.auth.jwt.JwtTokenProvider;
import com.irb.paxton.security.auth.jwt.token.RefreshToken;
import com.irb.paxton.security.auth.jwt.token.RefreshTokenService;
import com.irb.paxton.security.auth.login.response.LoginResponse;
import com.irb.paxton.security.auth.role.Role;
import com.irb.paxton.security.auth.user.PaxtonUserDetails;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserService;
import com.irb.paxton.security.auth.user.dto.UserLoginDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.stream.Collectors;

import static com.irb.paxton.config.ApplicationProperties.API_VERSION;
import static com.irb.paxton.utils.HttpUtils.getRequestIP;

@RestController
@Slf4j
@RequestMapping(path = "api/" + API_VERSION)
public class LoginController {

    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @Autowired
    JmsTemplate jmsTemplate;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private UserDeviceService userDeviceService;

    @Autowired
    private UserService userService;

    @PostMapping(path = "/auth/login")
    public ResponseEntity<?> token(HttpServletRequest request, @Valid @RequestBody UserLoginDto userLoginDto, @RequestHeader(value = HttpHeaders.USER_AGENT) String userAgent) {
        PaxtonUserDetails userDetails = (PaxtonUserDetails) this.authenticateUser(userLoginDto);
        User user = userDetails.getUserProfile().getUser();
        UserDevice userDevice = new UserDevice(getRequestIP(request), userAgent, user);

        // register device login
        UserDevice regDevice = userDeviceService.checkAndSaveUserDevice(userDevice);
        if (regDevice != null) {
            jmsTemplate.convertAndSend("userDeviceRegistrationQueue", userDevice);
        }

        String token = jwtTokenProvider.generateTokenFromUserDetails(userDetails);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getUsername());
        ResponseCookie jwtRefreshCookie = jwtTokenProvider.generateRefreshJwtCookie(refreshToken.getToken());

        log.info(String.format("Auth principal '%s' logged in, included authorities [%s]",
                userDetails.getUsername(), userDetails.getRoles().stream().map(Role::getName).collect(Collectors.joining(", ")))
        );

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtRefreshCookie.toString())
                .body(
                        new LoginResponse(token, jwtTokenProvider.getExpiresAtFromTokenAsLong(token),
                                refreshToken.getToken(), jwtTokenProvider.getExpiresAtFromTokenAsLong(refreshToken.getToken()))
                );
    }

    public UserDetails authenticateUser(UserLoginDto userLoginDto) {
        UsernamePasswordAuthenticationToken authReq = new UsernamePasswordAuthenticationToken(userLoginDto.getUsername(), userLoginDto.getPassword());
        Authentication authentication = authenticationManager.authenticate(authReq);
        PaxtonUserDetails userDetails = (PaxtonUserDetails) authentication.getPrincipal();
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return userDetails;
    }
}
