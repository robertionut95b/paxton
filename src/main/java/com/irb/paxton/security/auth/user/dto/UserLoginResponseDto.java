package com.irb.paxton.security.auth.user.dto;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Data
public class UserLoginResponseDto {

    @NotNull
    @NotEmpty
    @NotBlank
    private String username;

    @NotNull
    @NotEmpty
    @NotBlank
    private String firstName;

    @NotNull
    @NotEmpty
    @NotBlank
    private String lastName;

    @NotNull
    @NotEmpty
    @NotBlank
    private String profileSlugUrl;

    @NotNull
    private Long sessionTime;

    private List<String> roles;

    private List<String> permissions;
}
