package com.irb.paxton.security.auth.token;

import com.irb.paxton.security.auth.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.OffsetDateTime;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@MappedSuperclass
@SuperBuilder
public abstract class Token implements LimitedExpiryToken, UserAwareToken, UUIDIdentifiableToken {

    @Id
    @GeneratedValue(generator = "UUID")
    @Column(name = "id")
    private UUID id;

    @NotNull
    @Enumerated(value = EnumType.STRING)
    private TokenType tokenType;

    @NotNull
    private OffsetDateTime expiresAt = OffsetDateTime.now().plusMinutes(15);

    @ManyToOne(targetEntity = User.class)
    @JoinColumn(name = "user_id")
    private User user;

    protected Token(TokenType tokenType, User user) {
        this.tokenType = tokenType;
        this.user = user;
    }

    protected Token(TokenType tokenType, OffsetDateTime expiresAt, User user) {
        this.tokenType = tokenType;
        this.expiresAt = expiresAt;
        this.user = user;
    }

    @Override
    public boolean isExpired() {
        return OffsetDateTime.now().isAfter(this.getExpiresAt());
    }
}
