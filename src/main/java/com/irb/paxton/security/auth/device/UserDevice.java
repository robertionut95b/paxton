package com.irb.paxton.security.auth.device;

import com.irb.paxton.core.base.BaseEntity;
import com.irb.paxton.security.auth.user.User;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

import static com.irb.paxton.config.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_USER_DEVICE")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class UserDevice extends BaseEntity {

    @Setter(AccessLevel.NONE)
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotBlank
    @NotEmpty
    @NotNull
    private String ipAddress;

    @NotNull
    @NotEmpty
    @NotBlank
    private String agent;

    @NotNull
    private boolean isVerified = false;

    @NotNull
    private LocalDateTime expiresAt = LocalDateTime.now().plusDays(30);

    @NotNull
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public UserDevice(String ipAddress, String agent, User user) {
        this.ipAddress = ipAddress;
        this.agent = agent;
        this.user = user;
    }

    public UserDevice(String ipAddress, String agent, User user, boolean isVerified) {
        this.ipAddress = ipAddress;
        this.agent = agent;
        this.user = user;
        this.isVerified = isVerified;
    }
}
