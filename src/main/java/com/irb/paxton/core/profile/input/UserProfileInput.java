package com.irb.paxton.core.profile.input;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

@Data
public class UserProfileInput {

    @NotNull
    private Long id;

    @NotBlank
    @NotEmpty
    @NotNull
    private String firstName;

    @NotBlank
    @NotEmpty
    @NotNull
    private String lastName;

    @NotBlank
    @NotBlank
    @NotEmpty
    private String description;

    @NotBlank
    @NotBlank
    @NotEmpty
    private String city;

    @NotBlank
    @NotBlank
    @NotEmpty
    private String profileTitle;

    @NotBlank
    @NotEmpty
    @NotNull
    private String profileSlugUrl;
}
