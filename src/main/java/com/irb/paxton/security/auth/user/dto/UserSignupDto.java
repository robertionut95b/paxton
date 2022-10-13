package com.irb.paxton.security.auth.user.dto;

import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
public class UserSignupDto {

    @NotNull(message = "First name must not be null")
    @NotEmpty
    private String firstName;

    @NotEmpty
    @NotNull
    private String lastName;

    @NotEmpty
    @NotNull
    @Email
    private String email;

    @NotEmpty
    @NotNull
    private String username;

    @NotEmpty
    @NotNull
    private String password;

    @NotEmpty
    @NotNull
    private String confirmPassword;

    private LocalDate birthDate;
}
