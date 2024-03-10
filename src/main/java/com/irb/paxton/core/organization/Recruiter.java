package com.irb.paxton.core.organization;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.irb.paxton.core.model.PaxtonEntity;
import com.irb.paxton.security.auth.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Objects;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Recruiter extends PaxtonEntity {

    @ManyToOne
    @MapsId
    @JoinColumn(name = "id")
    private User user;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @NotNull
    private boolean isActive = true;

    private LocalDateTime lastActive;

    @Transient
    private OffsetDateTime registeredAt;

    public Recruiter(User user, Organization organization, boolean isActive, LocalDateTime lastActive) {
        this.user = user;
        this.organization = organization;
        this.isActive = isActive;
        this.lastActive = lastActive;
    }

    @PostLoad
    private void postLoad() {
        this.registeredAt = OffsetDateTime.of(this.getCreatedAt(), ZoneOffset.UTC);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Recruiter recruiter = (Recruiter) o;
        return id != null && Objects.equals(id, recruiter.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
