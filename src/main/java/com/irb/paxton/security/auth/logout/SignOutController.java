package com.irb.paxton.security.auth.logout;

import com.irb.paxton.security.AuthenticationService;
import com.irb.paxton.security.auth.jwt.JwtTokenProvider;
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
public class SignOutController {

    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @Autowired
    AuthenticationService authenticationService;

    @PostMapping(path = "/users/logout")
    public ResponseEntity<ApiResponse> signOut(HttpServletRequest request) {
        String token = jwtTokenProvider.getJwtRefreshFromCookies(request);
        authenticationService.logOutUserByToken(token);

        // clean refresh token cookie
        ResponseCookie jwtRefreshCookie = jwtTokenProvider.getCleanJwtRefreshCookie();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtRefreshCookie.toString())
                .header(HttpHeaders.AUTHORIZATION, "")
                .body(new ApiResponse("Successfully signed out", 200));
    }
}
