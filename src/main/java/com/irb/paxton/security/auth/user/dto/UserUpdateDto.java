package com.irb.paxton.security.auth.user.dto;

import com.irb.paxton.core.model.input.AbstractInput;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class UserUpdateDto extends AbstractInput {

    @NotNull
    private Long id;

    @NotBlank
    @NotNull
    @NotEmpty
    private String username;

    @Email
    @NotBlank
    @NotNull
    @NotEmpty
    private String email;
    @NotBlank
    @NotNull
    @NotEmpty
    private String firstName;

    @NotBlank
    @NotNull
    @NotEmpty
    private String lastName;
}
