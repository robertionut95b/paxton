package com.irb.paxton.security.auth.privilege;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.irb.paxton.core.model.PaxtonEntity;
import com.irb.paxton.security.auth.role.Role;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Collection;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Privilege extends PaxtonEntity {

    @NotNull
    @NotEmpty
    @NotBlank
    private String name;

    @ManyToMany(mappedBy = "privileges")
    @JsonIgnore
    private Collection<Role> roles;
}