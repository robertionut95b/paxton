package com.irb.paxton.security.auth.forgot;

import com.irb.paxton.security.AuthenticationService;
import com.irb.paxton.security.auth.forgot.request.FindEmailDto;
import com.irb.paxton.security.auth.forgot.request.PasswordChangeDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

import static com.irb.paxton.config.properties.ApplicationProperties.API_VERSION;

@RestController
@Slf4j
@Validated
@RequestMapping(path = "api/" + API_VERSION)
public class ForgotController {

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping(path = "/auth/forgot-password/request")
    @ResponseStatus(HttpStatus.OK)
    @Transactional
    public void sendForgotPasswordRequest(@RequestBody @Valid FindEmailDto findEmailDto, HttpServletRequest request) {
        authenticationService.sendEmailForgotPasswordRequest(findEmailDto);
    }

    @PostMapping(path = "/auth/forgot-password")
    @ResponseStatus(HttpStatus.OK)
    @Transactional
    public void changePasswordByRequest(@RequestParam @NotNull UUID token, @Valid @RequestBody PasswordChangeDto passwordChangeDto) {
        authenticationService.changePasswordByEmailRequest(token.toString(), passwordChangeDto);
    }
}
