package com.irb.paxton.security.auth.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import com.irb.paxton.core.candidate.Candidate;
import com.irb.paxton.core.model.PaxtonEntity;
import com.irb.paxton.core.profile.UserProfile;
import com.irb.paxton.security.auth.role.Role;
import com.irb.paxton.security.auth.user.credentials.Credentials;
import com.irb.paxton.security.oauth2.AuthProvider;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.Hibernate;

import java.time.LocalDate;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class User extends PaxtonEntity {

    @NotBlank
    @NotEmpty
    @NotNull
    private String firstName;

    @NotBlank
    @NotEmpty
    @NotNull
    private String lastName;

    @Transient
    private String displayName;

    @JsonDeserialize(using = LocalDateDeserializer.class)
    @JsonSerialize(using = LocalDateSerializer.class)
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
            name = "USER_ROLES",
            joinColumns = @JoinColumn(
                    name = "user_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(
                    name = "role_id", referencedColumnName = "id"),
            uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "role_id"})}
    )
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

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Candidate candidate;

    @ElementCollection(fetch = FetchType.EAGER)
    @Column(name = "auth_providers")
    @JsonIgnore
    @CollectionTable(name = "px_user_auth_providers", joinColumns = @JoinColumn(name = "owner_id"))
    private Set<AuthProvider> authProviders = new LinkedHashSet<>();

    public User(String firstName, String lastName, LocalDate birthDate, String email, String username, Collection<Role> roles, Credentials credentials, boolean isEmailConfirmed) {
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
        candidate = user.getCandidate();
        isEmailConfirmed = user.isEmailConfirmed();
    }

    public User(Long id, String email, String username) {
        this.id = id;
        this.email = email;
        this.username = username;
    }

    @PrePersist
    public void updateCreatedModifiedBy() {
        this.setCreatedBy(this.getUsername());
        this.setModifiedBy(this.getUsername());
    }

    @PostLoad
    public void onLoad() {
        this.displayName = this.getDisplayName();
    }

    public String getUserRolesAsString() {
        return getRoles().stream().map(Role::getName).collect(Collectors.joining(","));
    }

    public String getDisplayName() {
        return this.firstName != null && this.lastName != null ?
                "%s %s".formatted(this.lastName, this.firstName)
                : this.username;
    }

    public void addRole(Role role) {
        this.roles.add(role);
    }

    public void removeRole(Role role) {
        this.roles.remove(role);
    }

    public void addProvider(AuthProvider provider) {
        this.authProviders.add(provider);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        User user = (User) o;
        return id != null && Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}