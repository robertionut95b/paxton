package com.irb.paxton.security.auth.logout;

import com.irb.paxton.security.auth.jwt.JwtUtils;
import com.irb.paxton.security.auth.jwt.token.RefreshTokenService;
import com.irb.paxton.security.response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.Objects;

import static com.irb.paxton.config.ApplicationProperties.API_VERSION;
import static com.irb.paxton.security.SecurityUtils.isAuthenticated;

@RestController
@RequestMapping(path = "api/" + API_VERSION)
public class SignOutController {

    @Autowired
    JwtUtils jwtUtils;
    @Autowired
    private RefreshTokenService refreshTokenService;

    @PostMapping(path = "/auth/logout")
    public ResponseEntity<?> signOut(HttpServletRequest request) {
        if (!isAuthenticated()) {
            return new ResponseEntity<>(new ApiResponse("Not authenticated", 401), HttpStatus.UNAUTHORIZED);
        }

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!Objects.equals(principal.toString(), "anonymousUser")) {
            String username = ((UserDetails) principal).getUsername();
            refreshTokenService.deleteByUsername(username);
        }

        ResponseCookie jwtCookie = jwtUtils.getCleanJwtCookie();
        ResponseCookie jwtRefreshCookie = jwtUtils.getCleanJwtRefreshCookie();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .header(HttpHeaders.SET_COOKIE, jwtRefreshCookie.toString())
                .body(new ApiResponse("Successfully signed out", 200));
    }
}
