package com.irb.paxton.core.profile.input;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Data
public class UserProfileInput {

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
}
