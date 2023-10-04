package com.irb.paxton.security.auth.login;

import com.irb.paxton.security.AuthenticationService;
import com.irb.paxton.security.auth.jwt.JwtTokenProvider;
import com.irb.paxton.security.auth.jwt.token.exceptions.TokenRefreshException;
import com.irb.paxton.security.auth.login.response.LoginResponse;
import com.irb.paxton.security.response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.irb.paxton.config.properties.ApplicationProperties.API_VERSION;

@RestController
@RequestMapping(path = "api/" + API_VERSION)
public class RefreshLoginController {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/auth/refreshtoken")
    public ResponseEntity<?> refreshToken(HttpServletRequest request) {
        String refreshToken = jwtTokenProvider.getJwtRefreshFromCookies(request);
        LoginResponse loginResponse = null;
        try {
            loginResponse = authenticationService.refreshUserAuthenticationByToken(refreshToken);
        } catch (TokenRefreshException ex) {
            if (ex.getMessage().equals("Refresh token is no longer valid. Please login again")) {
                // clear user request cookie
                ResponseCookie jwtRefreshCookie = jwtTokenProvider.getCleanJwtRefreshCookie();
                return ResponseEntity.badRequest()
                        .header(HttpHeaders.SET_COOKIE, jwtRefreshCookie.toString())
                        .header(HttpHeaders.AUTHORIZATION, "")
                        .body(new ApiResponse(ex.getMessage(), 400));
            }
        }
        if (loginResponse != null) {
            ResponseCookie jwtRefreshCookie = jwtTokenProvider.generateRefreshJwtCookie(loginResponse.getRefreshToken());
            return ResponseEntity
                    .ok()
                    .header(HttpHeaders.SET_COOKIE, jwtRefreshCookie.toString())
                    .body(loginResponse);
        } else
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse("Refresh token is empty", 400));
    }
}
