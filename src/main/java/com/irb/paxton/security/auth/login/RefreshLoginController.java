package com.irb.paxton.security.auth.login;

import com.irb.paxton.security.auth.jwt.JwtUtils;
import com.irb.paxton.security.auth.jwt.token.RefreshToken;
import com.irb.paxton.security.auth.jwt.token.RefreshTokenService;
import com.irb.paxton.security.auth.jwt.token.exceptions.TokenRefreshException;
import com.irb.paxton.security.response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
public class RefreshLoginController {

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @PostMapping("/auth/refreshtoken")
    public ResponseEntity<?> refreshToken(HttpServletRequest request) {
        String refreshToken = jwtUtils.getJwtRefreshFromCookies(request);
        if ((refreshToken != null) && (refreshToken.length() > 0)) {
            return refreshTokenService.findByToken(refreshToken)
                    .map(refreshTokenService::verifyExpiration)
                    .map(RefreshToken::getUser)
                    .map(user -> {
                        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(user);
                        return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
//                                .header(HttpHeaders.SET_COOKIE, refreshToken)
                                .body(new ApiResponse("Token refresh successful", 200));
                    })
                    .orElseThrow(() -> new TokenRefreshException("Token not found"));
        }
        return ResponseEntity.badRequest().body(new ApiResponse("Refresh token is empty", 400));
    }
}
