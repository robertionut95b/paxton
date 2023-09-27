package com.irb.paxton.security.auth.jwt.token;

import com.irb.paxton.security.auth.user.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.NaturalId;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_REFRESH_TOKEN")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "px_refresh_token_id_seq")
    @SequenceGenerator(name = "px_refresh_token_id_seq", allocationSize = 1)
    private Long id;

    @NotEmpty
    @NotNull
    @NotBlank
    @Column(unique = true, length = 4000, nullable = false)
    @NaturalId(mutable = true)
    private String token;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Long refreshCount = 0L;

    @NotNull
    @Column(nullable = false)
    private LocalDateTime expiresAt;

    public void incrementRefreshCount() {
        refreshCount = refreshCount + 1;
    }
}
