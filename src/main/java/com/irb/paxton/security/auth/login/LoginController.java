package com.irb.paxton.security.auth.login;

import com.irb.paxton.security.AuthenticationService;
import com.irb.paxton.security.auth.jwt.JwtTokenProvider;
import com.irb.paxton.security.auth.login.response.LoginResponse;
import com.irb.paxton.security.auth.user.dto.UserLoginDto;
import com.irb.paxton.security.auth.user.dto.UserLoginTokenDto;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.irb.paxton.config.properties.ApplicationProperties.API_VERSION;

@RestController
@Slf4j
@RequestMapping(path = "api/" + API_VERSION)
public class LoginController {

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping(path = "/auth/login")
    public ResponseEntity<LoginResponse> loginByUsernameAndPassword(@Valid @RequestBody UserLoginDto userLoginDto) {
        LoginResponse loginResponse = authenticationService.loginByUsernameAndPassword(userLoginDto);
        ResponseCookie jwtRefreshCookie = jwtTokenProvider.generateRefreshJwtCookie(loginResponse.getRefreshToken());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtRefreshCookie.toString())
                .body(loginResponse);
    }

    @PostMapping(path = "/auth/login/token")
    public ResponseEntity<LoginResponse> loginByOAuth2CodeToken(@Valid @RequestBody UserLoginTokenDto requestBody) {
        LoginResponse loginResponse = authenticationService.loginByOAuth2Code(requestBody.getToken());
        ResponseCookie jwtRefreshCookie = jwtTokenProvider.generateRefreshJwtCookie(loginResponse.getRefreshToken());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtRefreshCookie.toString())
                .body(loginResponse);
    }
}
