package com.irb.paxton.security.auth.forgot.request;

import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Data
public class FindEmailDto {

    @NotEmpty
    @NotNull
    @Email
    private String email;
}
