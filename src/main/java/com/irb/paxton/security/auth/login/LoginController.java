package com.irb.paxton.security.auth.login;

import com.irb.paxton.security.auth.device.UserDevice;
import com.irb.paxton.security.auth.device.UserDeviceService;
import com.irb.paxton.security.auth.jwt.JwtResponse;
import com.irb.paxton.security.auth.jwt.JwtUtils;
import com.irb.paxton.security.auth.jwt.token.RefreshToken;
import com.irb.paxton.security.auth.jwt.token.RefreshTokenService;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserService;
import com.irb.paxton.security.auth.user.dto.UserLoginDto;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

import static com.irb.paxton.config.ApplicationProperties.API_VERSION;
import static com.irb.paxton.utils.HttpUtils.getRequestIP;

@RestController
@Slf4j
@RequestMapping(path = "api/" + API_VERSION)
public class LoginController {

    @Autowired
    JwtUtils jwtUtils;

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
        UsernamePasswordAuthenticationToken authReq = new UsernamePasswordAuthenticationToken(userLoginDto.getUsername(), userLoginDto.getPassword());
        Authentication authentication = authenticationManager.authenticate(authReq);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = this.userService.findByUsername(userLoginDto.getUsername()).orElseThrow(() -> new UserNotFoundException("Username not found"));
        UserDevice userDevice = new UserDevice(getRequestIP(request), userAgent, user);

        // register device login
        UserDevice regDevice = userDeviceService.checkAndSaveUserDevice(userDevice);
        if (regDevice != null) {
            jmsTemplate.convertAndSend("userDeviceRegistrationQueue", userDevice);
        }

        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(authentication);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getUsername());
        ResponseCookie jwtRefreshCookie = jwtUtils.generateRefreshJwtCookie(refreshToken.getToken());

        List<String> authorities = authentication.getAuthorities().stream().map(Object::toString).toList();
        log.info(String.format("Auth principal '%s' logged in, included authorities [%s]", authentication.getName(), authentication.getAuthorities().stream().map(Object::toString).collect(Collectors.joining(", "))));

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .header(HttpHeaders.SET_COOKIE, jwtRefreshCookie.toString())
                .body(new JwtResponse(authorities));
    }
}
