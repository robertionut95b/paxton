package com.irb.paxton.security.auth.signup;

import com.irb.paxton.security.AuthenticationService;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.dto.UserSignupDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

import static com.irb.paxton.config.properties.ApplicationProperties.API_VERSION;

@Validated
@RestController
@Slf4j
@RequestMapping(path = "api/" + API_VERSION)
public class SignupController {

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping(path = "/auth/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public User registerUser(@RequestBody @Valid UserSignupDto userDto) {
        return authenticationService.registerUser(userDto);
    }

    @GetMapping(path = "/auth/signup/confirmation")
    @ResponseStatus(HttpStatus.OK)
    public void confirmRegistration(@RequestParam @NotNull UUID token) {
        authenticationService.confirmUserRegistrationByEmailToken(String.valueOf(token));
    }
}
