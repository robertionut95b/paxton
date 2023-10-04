package com.irb.paxton.security.oauth2;

import com.irb.paxton.config.properties.AuthenticationProperties;
import com.irb.paxton.security.auth.jwt.JwtTokenProvider;
import com.irb.paxton.security.auth.token.OAuth2Token;
import com.irb.paxton.security.auth.token.OAuth2TokenService;
import com.irb.paxton.security.auth.user.PaxtonUserDetails;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Slf4j
@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private AuthenticationProperties authenticationProperties;

    @Autowired
    private OAuth2TokenService oAuth2TokenService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        handle(request, response, authentication);
        super.clearAuthenticationAttributes(request);
    }

    @Override
    protected void handle(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        String targetUrl = authenticationProperties.getOauth2RedirectUri().isEmpty() ? determineTargetUrl(request, response, authentication) : authenticationProperties.getOauth2RedirectUri();
        PaxtonUserDetails paxtonUserDetails = (PaxtonUserDetails) authentication.getPrincipal();

        OAuth2Token oAuth2Token = oAuth2TokenService.createTokenForUser(paxtonUserDetails);
        targetUrl = UriComponentsBuilder.fromUriString(targetUrl).queryParam("token", oAuth2Token.getId()).build().toUriString();
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
