package com.irb.paxton.security.auth.user.credentials;

import com.irb.paxton.auditable.AuditableEntity;
import com.irb.paxton.core.model.PaxtonEntity;
import com.irb.paxton.security.auth.user.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.lang.Nullable;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_CREDENTIALS")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Credentials extends PaxtonEntity<Long> {

    @NotNull
    @Enumerated(EnumType.STRING)
    private CredentialsType credentialsType = CredentialsType.PASSWORD;

    @NotNull
    @NotBlank
    @NotEmpty
    @Column(name = "CREDENTIALS_VALUE")
    private String value;

    @NotNull
    private boolean isActive;

    @Nullable
    private LocalDate lastActiveAt;

    @OneToOne(mappedBy = "credentials")
    private User user;
}
