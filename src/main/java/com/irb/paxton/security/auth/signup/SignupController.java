package com.irb.paxton.security.auth.signup;

import com.irb.paxton.security.auth.signup.response.AccountRegistration;
import com.irb.paxton.security.auth.signup.response.AccountWelcome;
import com.irb.paxton.security.auth.token.RegistrationToken;
import com.irb.paxton.security.auth.token.RegistrationTokenService;
import com.irb.paxton.security.auth.token.exceptions.TokenExpiredException;
import com.irb.paxton.security.auth.token.exceptions.TokenNotFoundException;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserService;
import com.irb.paxton.security.auth.user.dto.UserSignupDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

import static com.irb.paxton.config.properties.ApplicationProperties.API_VERSION;

@Validated
@RestController
@Slf4j
@RequestMapping(path = "api/" + API_VERSION)
public class SignupController {
    @Autowired
    JmsTemplate jmsTemplate;
    @Autowired
    private UserService userService;
    @Autowired
    private RegistrationTokenService registrationTokenService;

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(path = "/auth/signup")
    @Transactional
    User registerUser(@RequestBody @Valid UserSignupDto userDto, HttpServletRequest request) {
        User user = userService.registerNewUser(userDto);
        RegistrationToken token = registrationTokenService.createUserRegistrationToken(user);
        jmsTemplate.convertAndSend("userAccountRegistrationQueue",
                new AccountRegistration(user, token.getId().toString(), ServletUriComponentsBuilder.fromRequestUri(request).replacePath(null).build().toUriString())
        );
        log.info(String.format("Created user login : %s - Confirmation email message will initiate", user.getUsername()));
        return user;
    }

    @GetMapping(path = "/auth/signup/confirmation")
    @ResponseStatus(HttpStatus.OK)
    @Transactional
    void confirmRegistration(@RequestParam @NotNull UUID token) {
        RegistrationToken registrationToken = registrationTokenService.getRegistrationToken(token).orElseThrow(
                () -> new TokenNotFoundException("Could not find valid token")
        );

        if (registrationToken.getExpired()) {
            throw new TokenExpiredException("Token is expired, please re-submit a signup request");
        }

        User user = registrationToken.getUser();
        userService.confirmEmailUser(user);
        registrationTokenService.expireToken(registrationToken);
        log.info(String.format("User %s - confirmed account by email token", user.getUsername()));
        // send marketing welcome email
        jmsTemplate.convertAndSend("userAccountWelcomeQueue", new AccountWelcome(user));
    }
}
