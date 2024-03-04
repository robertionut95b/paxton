package com.irb.paxton.security.auth;

import com.irb.paxton.security.AuthenticationService;
import com.irb.paxton.security.SecurityUtils;
import com.irb.paxton.security.auth.device.UserDevice;
import com.irb.paxton.security.auth.device.UserDeviceService;
import com.irb.paxton.security.auth.forgot.request.FindEmailDto;
import com.irb.paxton.security.auth.forgot.request.PasswordChangeDto;
import com.irb.paxton.security.auth.forgot.response.ForgotPasswordRequest;
import com.irb.paxton.security.auth.jwt.JwtTokenProvider;
import com.irb.paxton.security.auth.jwt.token.RefreshToken;
import com.irb.paxton.security.auth.jwt.token.RefreshTokenService;
import com.irb.paxton.security.auth.jwt.token.exceptions.TokenRefreshException;
import com.irb.paxton.security.auth.jwt.token.exceptions.TokenRefreshNotFoundException;
import com.irb.paxton.security.auth.login.response.LoginResponse;
import com.irb.paxton.security.auth.logout.event.OnUserLogoutSuccess;
import com.irb.paxton.security.auth.role.Role;
import com.irb.paxton.security.auth.signup.response.AccountRegistration;
import com.irb.paxton.security.auth.signup.response.AccountWelcome;
import com.irb.paxton.security.auth.token.*;
import com.irb.paxton.security.auth.token.events.TokenExpirationEvent;
import com.irb.paxton.security.auth.token.exceptions.TokenExpiredException;
import com.irb.paxton.security.auth.token.exceptions.TokenNotFoundException;
import com.irb.paxton.security.auth.user.PaxtonUserDetails;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserService;
import com.irb.paxton.security.auth.user.credentials.Credentials;
import com.irb.paxton.security.auth.user.credentials.CredentialsType;
import com.irb.paxton.security.auth.user.dto.UserLoginDto;
import com.irb.paxton.security.auth.user.dto.UserSignupDto;
import com.irb.paxton.security.auth.user.exceptions.InactiveUserException;
import com.irb.paxton.security.auth.user.exceptions.InvalidPasswordException;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.UUID;
import java.util.stream.Collectors;

import static com.irb.paxton.utils.HttpUtils.getRequestIP;

@Service
@Slf4j
public class AuthenticationServiceImpl implements AuthenticationService {

    @Autowired
    HttpServletRequest request;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JmsTemplate jmsTemplate;

    @Autowired
    private RegistrationTokenService registrationTokenService;

    @Autowired
    private ForgotTokenService forgotTokenService;

    @Autowired
    private UserDeviceService userDeviceService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private OAuth2TokenService oAuth2TokenService;

    @Override
    @Transactional
    public User registerUser(UserSignupDto userSignupDto) {
        User user = userService.registerNewUser(userSignupDto);
        RegistrationToken token = registrationTokenService.createTokenForUser(user);

        jmsTemplate.convertAndSend("userAccountRegistrationQueue",
                new AccountRegistration(user, token.getId().toString(), ServletUriComponentsBuilder.fromRequestUri(request).replacePath(null).build().toUriString())
        );

        log.info(String.format("Created user login [%s] - Sending confirmation email", user.getUsername()));
        return user;
    }

    @Override
    @Transactional
    public void confirmUserRegistrationByEmailToken(String token) {
        RegistrationToken registrationToken = registrationTokenService.getTokenById(UUID.fromString(token))
                .orElseThrow(
                        () -> new TokenNotFoundException("Could not find a valid token")
                );

        if (registrationToken.isExpired()) {
            throw new TokenExpiredException("Token is expired, please re-submit a signup request");
        }

        User user = registrationToken.getUser();
        userService.confirmEmailUser(user);
        log.info(String.format("Login [%s] - confirmed account by email", user.getUsername()));

        // send marketing welcome email
        jmsTemplate.convertAndSend("userAccountWelcomeQueue", new AccountWelcome(user));
        // expire token
        jmsTemplate.convertAndSend("tokenExpirationQueue", new TokenExpirationEvent(registrationToken.getId().toString(), registrationToken.getUser(), TokenType.REGISTRATION));
    }

    @Override
    @Transactional
    public void sendEmailForgotPasswordRequest(FindEmailDto findEmailDto) {
        String email = findEmailDto.getEmail();
        User user = userService.findByEmail(email).orElseThrow(() -> new UserNotFoundException("Email %s not found".formatted(email)));

        if (!user.isEmailConfirmed()) {
            throw new InactiveUserException("User is not active");
        }

        ForgotPasswordToken token = forgotTokenService.createTokenForUser(user);
        jmsTemplate.convertAndSend("userForgotRegistrationQueue",
                new ForgotPasswordRequest(user, token.getId().toString(), ServletUriComponentsBuilder.fromRequestUri(request).replacePath(null).build().toUriString())
        );
    }

    @Override
    @Transactional
    public void changePasswordByEmailRequest(String token, PasswordChangeDto passwordChangeDto) {
        ForgotPasswordToken forgotPasswordToken = forgotTokenService.getTokenById(UUID.fromString(token))
                .orElseThrow(
                        () -> new TokenNotFoundException("Could not find valid token")
                );

        if (forgotPasswordToken.isExpired()) {
            throw new TokenExpiredException("Token is expired, please re-submit a request");
        }

        if (!passwordChangeDto.getNewPassword().equals(passwordChangeDto.getConfirmPassword())) {
            throw new InvalidPasswordException("Passwords do not match");
        }

        User user = forgotPasswordToken.getUser();
        user.setCredentials(new Credentials(CredentialsType.PASSWORD, new BCryptPasswordEncoder().encode(passwordChangeDto.getNewPassword()), false, null, null));
        userService.updateUser(user);
        // expire token
        jmsTemplate.convertAndSend("tokenExpirationQueue", new TokenExpirationEvent(forgotPasswordToken.getId().toString(), forgotPasswordToken.getUser(), TokenType.PASSWORD_RESET));
    }

    @Override
    public LoginResponse loginByUsernameAndPassword(UserLoginDto userLoginDto) {
        String userAgent = request.getHeader(HttpHeaders.USER_AGENT);
        PaxtonUserDetails userDetails = (PaxtonUserDetails) this.authenticateUser(userLoginDto);
        User user = userDetails.getUserProfile().getUser();
        UserDevice userDevice = new UserDevice(getRequestIP(request), userAgent, user);

        // register device login
        UserDevice regDevice = userDeviceService.checkAndSaveUserDevice(userDevice);
        if (regDevice != null) {
            jmsTemplate.convertAndSend("userDeviceRegistrationQueue", userDevice);
        }

        String token = jwtTokenProvider.generateTokenFromUserDetails(userDetails);
        RefreshToken refreshToken = refreshTokenService.createRefreshTokenForUsername(userDetails.getUsername());

        log.info(String.format("Auth principal [%s] logged in, included authorities [%s]",
                userDetails.getUsername(), userDetails.getRoles().stream().map(Role::getName).collect(Collectors.joining(", ")))
        );

        return new LoginResponse(token, jwtTokenProvider.getExpiresAtFromTokenAsLong(token),
                refreshToken.getToken(), jwtTokenProvider.getExpiresAtFromTokenAsLong(refreshToken.getToken()));
    }

    @Override
    public UserDetails authenticateUser(UserLoginDto userLoginDto) {
        UsernamePasswordAuthenticationToken authReq = new UsernamePasswordAuthenticationToken(userLoginDto.getUsername(), userLoginDto.getPassword());
        Authentication authentication = authenticationManager.authenticate(authReq);
        PaxtonUserDetails userDetails = (PaxtonUserDetails) authentication.getPrincipal();
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return userDetails;
    }

    @Override
    @Transactional
    public LoginResponse loginByOAuth2Code(String token) {
        String userAgent = request.getHeader(HttpHeaders.USER_AGENT);
        OAuth2Token oAuth2Token = oAuth2TokenService
                .getTokenById(UUID.fromString(token))
                .map(t -> {
                    if (t.isExpired()) {
                        throw new TokenExpiredException("Token is expired, please re-submit login request");
                    } else return t;
                })
                .orElseThrow(() -> new TokenNotFoundException("Token does not exist"));

        User user = oAuth2Token.getUser();
        UserDevice userDevice = new UserDevice(getRequestIP(request), userAgent, user);

        // register device login
        UserDevice regDevice = userDeviceService.checkAndSaveUserDevice(userDevice);
        if (regDevice != null) {
            jmsTemplate.convertAndSend("userDeviceRegistrationQueue", userDevice);
        }

        String jwt = jwtTokenProvider.generateTokenFromUser(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshTokenForUsername(user.getUsername());

        log.info(String.format("Auth principal [%s] logged in by OAuth2 code, included authorities [%s]",
                user.getUsername(), user.getRoles().stream().map(Role::getName).collect(Collectors.joining(", ")))
        );

        // expire token
        jmsTemplate.convertAndSend("tokenExpirationQueue", new TokenExpirationEvent(oAuth2Token.getId().toString(), oAuth2Token.getUser(), TokenType.OAUTH2_AUTHORIZATION));

        return new LoginResponse(jwt, jwtTokenProvider.getExpiresAtFromTokenAsLong(jwt),
                refreshToken.getToken(), jwtTokenProvider.getExpiresAtFromTokenAsLong(refreshToken.getToken()));
    }

    @Override
    @Transactional
    public LoginResponse refreshUserAuthenticationByToken(String refreshToken) {
        if ((refreshToken == null) || (refreshToken.isEmpty())) {
            throw new TokenRefreshNotFoundException("Token not found");
        }
        RefreshToken refreshTokenEntity = refreshTokenService.findByToken(refreshToken)
                .orElseThrow(() -> new TokenRefreshNotFoundException("Token not found"));

        refreshTokenService.verifyExpiration(refreshTokenEntity);
        if (refreshTokenService.verifyReuse(refreshTokenEntity)) {
            throw new TokenRefreshException("Refresh token is no longer valid. Please login again");
        }
        refreshTokenEntity.incrementRefreshCount();
        // regenerate a new refresh token
        RefreshToken newRefreshTokenEntity = refreshTokenService.createRefreshTokenForUsername(refreshTokenEntity.getUser().getUsername());
        String token = jwtTokenProvider.generateTokenFromUser(newRefreshTokenEntity.getUser());

        return new LoginResponse(token, jwtTokenProvider.getExpiresAtFromTokenAsLong(token),
                newRefreshTokenEntity.getToken(), jwtTokenProvider.getExpiresAtFromTokenAsLong(newRefreshTokenEntity.getToken()));
    }

    @Override
    public void logOutUserByToken(String token) {
        String userAgent = request.getHeader(HttpHeaders.USER_AGENT);
        RefreshToken tokenInstance = this.refreshTokenService.findByToken(token).orElseThrow(() -> new TokenNotFoundException("Token does not exist"));
        User user = tokenInstance.getUser();

        refreshTokenService.deleteByToken(token);
        jmsTemplate.convertAndSend("userAuthLogout",
                new OnUserLogoutSuccess(user.getUsername(), token, new UserDevice(getRequestIP(request), userAgent, user))
        );
    }

    public Authentication identifyUserInToken(String token) {
        Authentication authentication = jwtTokenProvider.getAuthentication(token);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return authentication;
    }

    @Override
    public User getCurrentUserFromSecurityContext() throws AuthenticationException, UserNotFoundException {
        String user = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return userService
                .findByUsername(user)
                .orElseThrow(() -> new UserNotFoundException("User [%s] does not exist".formatted(user)));
    }
}
