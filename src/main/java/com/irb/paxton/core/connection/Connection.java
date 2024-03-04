package com.irb.paxton.core.connection;

import com.irb.paxton.core.connection.status.ConnectionStatus;
import com.irb.paxton.core.model.PaxtonEntity;
import com.irb.paxton.security.auth.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(name = "PX_CONNECTIONS", uniqueConstraints = {
        @UniqueConstraint(name = "uc_connection_requester_addressed_id", columnNames = {"requester_id", "addressed_id"})
})
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Connection extends PaxtonEntity {

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User requester;

    @ManyToOne
    @JoinColumn(name = "addressed_id")
    private User addressed;

    @Enumerated(value = EnumType.STRING)
    private ConnectionStatus connectionStatus = ConnectionStatus.REQUESTED;

    @NotNull
    @PastOrPresent
    private OffsetDateTime lastModified = OffsetDateTime.now();


    @PostUpdate
    public void postUpdate() {
        this.lastModified = OffsetDateTime.now();
    }

    @PostPersist
    public void postPersist() {
        this.lastModified = OffsetDateTime.now();
    }
}
