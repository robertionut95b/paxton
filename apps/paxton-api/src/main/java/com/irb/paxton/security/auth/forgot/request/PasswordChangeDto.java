package com.irb.paxton.security.auth.forgot.request;

import com.irb.paxton.security.auth.user.validation.ValidPassword;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Data
public class PasswordChangeDto {

    @NotNull
    @NotEmpty
    @NotBlank
    @ValidPassword
    private String newPassword;

    @NotNull
    @NotEmpty
    @NotBlank
    @ValidPassword
    private String confirmPassword;
}
