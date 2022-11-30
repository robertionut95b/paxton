package com.irb.paxton.security.auth.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.irb.paxton.core.base.BaseEntity;
import com.irb.paxton.core.profile.UserProfile;
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

    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
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

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL, mappedBy = "user")
    @JoinColumn(name = "user_profile_id")
    @JsonIgnore
    private UserProfile userProfile;

    public User(Long id, String firstName, String lastName, LocalDate birthDate, String email, String username, Collection<Role> roles, Credentials credentials, boolean isEmailConfirmed) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthDate = birthDate;
        this.email = email;
        this.username = username;
        this.roles = roles;
        this.credentials = credentials;
        this.isEmailConfirmed = isEmailConfirmed;
    }

    public User(User user) {
        id = user.getId();
        firstName = user.getFirstName();
        lastName = user.getLastName();
        birthDate = user.getBirthDate();
        email = user.getEmail();
        username = user.getUsername();
        roles = user.getRoles();
        credentials = user.getCredentials();
        userProfile = user.getUserProfile();
        isEmailConfirmed = user.isEmailConfirmed();
    }
}