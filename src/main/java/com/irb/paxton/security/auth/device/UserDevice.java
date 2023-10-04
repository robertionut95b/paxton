package com.irb.paxton.security.auth.device;

import com.irb.paxton.core.model.PaxtonEntity;
import com.irb.paxton.security.auth.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_USER_DEVICE")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class UserDevice extends PaxtonEntity<Long> {

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
