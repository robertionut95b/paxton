package com.irb.paxton.core.messaging;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.irb.paxton.core.model.PaxtonEntity;
import com.irb.paxton.security.auth.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.time.OffsetDateTime;
import java.util.Objects;


@Entity
@Table(
        uniqueConstraints = {
                @UniqueConstraint(name = "UQ_MESSAGE_SEEN_BY_USER_MESSAGE", columnNames = {"user_id", "message_id"})
        }
)
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MessageSeenBy extends PaxtonEntity {

    @JsonBackReference("user")
    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private User user;

    @JsonBackReference("seenBy")
    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Message message;

    @NotNull
    @PastOrPresent
    private OffsetDateTime seenAt = OffsetDateTime.now();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        MessageSeenBy that = (MessageSeenBy) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
