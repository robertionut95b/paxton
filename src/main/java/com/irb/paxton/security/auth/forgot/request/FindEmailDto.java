package com.irb.paxton.security.auth.forgot.request;

import lombok.Data;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

@Data
public class FindEmailDto {

    @NotEmpty
    @NotNull
    @Email
    private String email;
}
