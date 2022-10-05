package com.irb.paxton.security.auth.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.irb.paxton.base.BaseEntity;
import com.irb.paxton.security.auth.role.Role;
import com.irb.paxton.security.auth.user.credentials.Credentials;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.Collection;

import static com.irb.paxton.config.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_USER")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotBlank
    @NotEmpty
    @NotNull
    private String firstName;

    @NotBlank
    @NotEmpty
    @NotNull
    private String lastName;

    private LocalDate birthDate;

    @Email
    @NotBlank
    @NotEmpty
    @NotNull
    @Column(unique = true)
    private String email;

    @NotBlank
    @NotEmpty
    @NotNull
    @Column(unique = true)
    private String username;

    @ManyToMany
    @JoinTable(
            name = TABLE_PREFIX + "_USER_ROLES",
            joinColumns = @JoinColumn(
                    name = "user_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(
                    name = "role_id", referencedColumnName = "id"))
    private Collection<Role> roles;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "credentials_id", referencedColumnName = "id")
    @JsonIgnore
    private Credentials credentials;

    @NotNull
    private boolean isEmailConfirmed = false;
}