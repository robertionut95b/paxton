package com.irb.paxton.security.auth.login;

import com.irb.paxton.security.auth.jwt.JwtTokenProvider;
import com.irb.paxton.security.auth.jwt.token.RefreshToken;
import com.irb.paxton.security.auth.jwt.token.RefreshTokenService;
import com.irb.paxton.security.auth.jwt.token.exceptions.TokenRefreshNotFoundException;
import com.irb.paxton.security.auth.login.response.LoginResponse;
import com.irb.paxton.security.response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;

import static com.irb.paxton.config.properties.ApplicationProperties.API_VERSION;

@RestController
@RequestMapping(path = "api/" + API_VERSION)
public class RefreshLoginController {

    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @PostMapping("/auth/refreshtoken")
    public ResponseEntity<?> refreshToken(HttpServletRequest request) {
        String refreshToken = jwtTokenProvider.getJwtRefreshFromCookies(request);
        if ((refreshToken != null) && (refreshToken.length() > 0)) {
            return refreshTokenService.findByToken(refreshToken)
                    .map(refreshToken1 -> {
                        refreshTokenService.verifyExpiration(refreshToken1);
                        refreshTokenService.increaseCount(refreshToken1);
                        return refreshToken1;
                    })
                    .map(RefreshToken::getUser)
                    .map(user -> {
                        String token = jwtTokenProvider.generateTokenFromUser(user);
                        return ResponseEntity.ok()
                                .body(new LoginResponse(token, jwtTokenProvider.getExpiresAtFromTokenAsLong(token),
                                        refreshToken, jwtTokenProvider.getExpiresAtFromTokenAsLong(refreshToken))
                                );
                    })
                    .orElseThrow(() -> new TokenRefreshNotFoundException("Token not found"));
        }
        return ResponseEntity.badRequest().body(new ApiResponse("Refresh token is empty", 400));
    }
}
