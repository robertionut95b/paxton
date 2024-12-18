package com.irb.paxton.security.auth.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record UserCreateDto(@NotBlank @NotNull @NotEmpty String username,
                            @Email @NotBlank @NotNull @NotEmpty String email,
                            @NotBlank @NotNull @NotEmpty String firstName,
                            @NotBlank @NotNull @NotEmpty String lastName) {
}
