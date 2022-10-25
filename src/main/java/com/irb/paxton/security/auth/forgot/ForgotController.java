package com.irb.paxton.security.auth.forgot;

import com.irb.paxton.security.auth.forgot.request.FindEmailDto;
import com.irb.paxton.security.auth.forgot.request.PasswordChangeDto;
import com.irb.paxton.security.auth.forgot.response.ForgotPasswordRequest;
import com.irb.paxton.security.auth.token.ForgotPasswordToken;
import com.irb.paxton.security.auth.token.ForgotTokenService;
import com.irb.paxton.security.auth.token.exceptions.TokenExpiredException;
import com.irb.paxton.security.auth.token.exceptions.TokenNotFoundException;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserService;
import com.irb.paxton.security.auth.user.credentials.Credentials;
import com.irb.paxton.security.auth.user.credentials.CredentialsType;
import com.irb.paxton.security.auth.user.exceptions.InactiveUserException;
import com.irb.paxton.security.auth.user.exceptions.InvalidPasswordException;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.UUID;

import static com.irb.paxton.config.ApplicationProperties.API_VERSION;

@RestController
@Slf4j
@Validated
@RequestMapping(path = "api/" + API_VERSION)
public class ForgotController {

    @Autowired
    JmsTemplate jmsTemplate;
    @Autowired
    private UserService userService;
    @Autowired
    private ForgotTokenService forgotTokenService;

    @PostMapping(path = "/auth/forgot-password/request")
    @Transactional
    public void sendForgotPasswordRequest(@RequestBody @Valid FindEmailDto findEmailDto, HttpServletRequest request) {
        String email = findEmailDto.getEmail();
        User user = userService.findByEmail(email).orElseThrow(() -> new UserNotFoundException(String.format("Email %s not found", email)));

        if (!user.isEmailConfirmed()) {
            throw new InactiveUserException("User is not active");
        }

        ForgotPasswordToken token = forgotTokenService.createForgotRequestToken(user);
        jmsTemplate.convertAndSend("userForgotRegistrationQueue",
                new ForgotPasswordRequest(user, token.getId().toString(), ServletUriComponentsBuilder.fromRequestUri(request).replacePath(null).build().toUriString())
        );
    }

    @PostMapping(path = "/auth/forgot-password")
    @Transactional
    public void changePasswordByRequest(@RequestParam("token") @NotNull UUID token, @Valid @RequestBody PasswordChangeDto passwordChangeDto) {
        ForgotPasswordToken forgotPasswordToken = forgotTokenService.getForgotRequestToken(token).orElseThrow(
                () -> new TokenNotFoundException("Could not find valid token")
        );

        if (forgotPasswordToken.getExpired()) {
            throw new TokenExpiredException("Token is expired, please re-submit a request");
        }

        if (!passwordChangeDto.getNewPassword().equals(passwordChangeDto.getConfirmPassword())) {
            throw new InvalidPasswordException("Passwords do not match");
        }

        User user = forgotPasswordToken.getUser();
        user.setCredentials(new Credentials(null, CredentialsType.PASSWORD, new BCryptPasswordEncoder().encode(passwordChangeDto.getNewPassword()), false, null, null));
        userService.updateUser(user);
        forgotTokenService.expireToken(forgotPasswordToken);
    }
}
