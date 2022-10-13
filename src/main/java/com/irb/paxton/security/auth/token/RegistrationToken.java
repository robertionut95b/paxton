package com.irb.paxton.security.auth.token;

import com.irb.paxton.security.auth.user.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

import static com.irb.paxton.config.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_REGISTRATION_TOKEN")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@SuperBuilder
public class RegistrationToken extends Token {

    @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "user_id")
    private User user;

    @NotNull
    private LocalDateTime expiresAt;

    @Transient
    private Boolean isExpired;

    public Boolean getExpired() {
        return LocalDateTime.now().isAfter(this.expiresAt);
    }
}
