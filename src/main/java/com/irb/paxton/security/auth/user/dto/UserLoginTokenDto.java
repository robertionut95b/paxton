package com.irb.paxton.security.auth.user.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserLoginTokenDto {

    @NotNull
    @NotEmpty
    private String token;
}
