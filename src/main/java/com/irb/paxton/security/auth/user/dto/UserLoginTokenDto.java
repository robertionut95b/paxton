package com.irb.paxton.security.auth.user.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.UUID;

@Data
public class UserLoginTokenDto {

    @NotNull
    @NotEmpty
    @UUID
    private String token;
}
