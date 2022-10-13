package com.irb.paxton.security.auth.privilege;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.irb.paxton.core.base.BaseEntity;
import com.irb.paxton.security.auth.role.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Collection;

import static com.irb.paxton.config.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_PRIVILEGE")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Privilege extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @NotEmpty
    @NotBlank
    private String name;

    @ManyToMany(mappedBy = "privileges")
    @JsonIgnore
    private Collection<Role> roles;
}