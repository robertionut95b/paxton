package com.irb.paxton.security.auth.token;

import com.irb.paxton.security.auth.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.OffsetDateTime;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_FORGOT_PASSWORD_TOKEN")
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
public class ForgotPasswordToken extends Token {

    public ForgotPasswordToken(@Future(message = "Expires at must be higher than current date") @NotNull OffsetDateTime expiresAt, User user) {
        super(TokenType.PASSWORD_RESET, expiresAt, user);
    }

    public ForgotPasswordToken(User user) {
        super(TokenType.PASSWORD_RESET, user);
    }
}
