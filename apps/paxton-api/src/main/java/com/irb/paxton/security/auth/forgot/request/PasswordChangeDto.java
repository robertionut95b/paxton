package com.irb.paxton.security.auth.forgot.request;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Data
public class PasswordChangeDto {

    @NotNull
    @NotEmpty
    @NotBlank
    private String newPassword;

    @NotNull
    @NotEmpty
    @NotBlank
    private String confirmPassword;
}
