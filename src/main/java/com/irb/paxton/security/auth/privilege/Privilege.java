package com.irb.paxton.security.auth.privilege;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.irb.paxton.auditable.AuditableEntity;
import com.irb.paxton.core.model.PaxtonEntity;
import com.irb.paxton.security.auth.role.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.Collection;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_PRIVILEGE")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Privilege extends PaxtonEntity<Long> {

    @NotNull
    @NotEmpty
    @NotBlank
    private String name;

    @ManyToMany(mappedBy = "privileges")
    @JsonIgnore
    private Collection<Role> roles;
}